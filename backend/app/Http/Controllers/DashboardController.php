<?php

namespace App\Http\Controllers;

use App\Http\Resources\ItemResource;
use App\Http\Resources\RequestResource;
use App\Http\Resources\ShipmentResource;
use App\Models\Item;
use App\Models\Request as ItemRequest;
use App\Models\Shipment;
use App\Models\User;
use App\Services\FileUploadService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use App\Models\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    // Inject FileUploadService dan NotificationService via constructor
    public function __construct(
        protected FileUploadService   $uploadService,
        protected NotificationService $notifService
    ) {}

    /**
     * GET /api/admin/dashboard/stats
     * Statistik ringkas platform — untuk kartu angka di dashboard admin.
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'code'   => 200,
            'status' => 'success',
            'data'   => [
                'stats' => [
                    'users' => [
                        'total'    => User::count(),
                        'active'   => User::where('is_active', true)->count(),
                        'inactive' => User::where('is_active', false)->count(),
                    ],
                    'items' => [
                        'total'     => Item::count(),
                        'available' => Item::where('status', 'available')->count(),
                        'reserved'  => Item::where('status', 'reserved')->count(),
                        'donated'   => Item::where('status', 'donated')->count(),
                    ],
                    'requests' => [
                        'total'     => ItemRequest::count(),
                        'pending'   => ItemRequest::where('status', 'pending')->count(),
                        'approved'  => ItemRequest::where('status', 'approved')->count(),
                        'rejected'  => ItemRequest::where('status', 'rejected')->count(),
                        'cancelled' => ItemRequest::where('status', 'cancelled')->count(),
                    ],
                    'shipments' => [
                        'total'      => Shipment::count(),
                        'preparing'  => Shipment::where('status', 'preparing')->count(),
                        'in_transit' => Shipment::where('status', 'in_transit')->count(),
                        'delivered'  => Shipment::where('status', 'delivered')->count(),
                    ],
                ]
            ]
        ], 200);
    }

    /**
     * GET /api/admin/items
     * Monitor semua item di platform — dengan filter dan search.
     */
    public function allItems(Request $request): JsonResponse
    {
        $request->validate([
            'search'      => ['nullable', 'string', 'max:100'],
            'status'      => ['nullable', 'in:available,reserved,donated'],
            'category_id' => ['nullable', 'integer'],
            'donor_id'    => ['nullable', 'integer'],
            'per_page'    => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $items = Item::with(['donor', 'category'])
            ->withCount('requests')
            ->when(
                $request->search,
                fn($q, $s) =>
                $q->where('title', 'like', "%{$s}%")
            )
            ->when($request->status,      fn($q, $v) => $q->where('status', $v))
            ->when($request->category_id, fn($q, $v) => $q->where('category_id', $v))
            ->when($request->donor_id,    fn($q, $v) => $q->where('donor_id', $v))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'code'   => 200,
            'status' => 'success',
            'data'   => [
                'items' => ItemResource::collection($items),
                'meta'  => [
                    'total'        => $items->total(),
                    'per_page'     => $items->perPage(),
                    'current_page' => $items->currentPage(),
                    'last_page'    => $items->lastPage(),
                ],
            ]
        ], 200);
    }

    /**
     * DELETE /api/admin/items/{id}
     * Admin force-delete item — terlepas dari statusnya.
     * Mengirimkan notifikasi sebelum sistem melakukan CASCADE.
     */
    public function forceDeleteItem(string $id): JsonResponse
    {
        // Tarik item sekaligus request yang masih aktif (biar bisa dikasih notif)
        $item = Item::with(['requests' => function ($query) {
            $query->whereIn('status', ['pending', 'approved']);
        }])->find($id);

        if (!$item) {
            return $this->errorResponse('Item tidak ditemukan.', 404);
        }

        // 1. Kirim Notif ke Donatur (Pemilik Item)
        $this->notifService->send(
            userId: $item->donor_id,
            type: 'item_deleted',
            title: 'Barang Dihapus Admin',
            message: 'Barang kamu "' . $item->title . '" dihapus oleh Admin karena melanggar kebijakan platform.'
        );

        // 2. Kirim Notif ke Para Penerima (Requester) yang terdampak
        foreach ($item->requests as $req) {
            $this->notifService->send(
                userId: $req->requester_id,
                type: 'request_cancelled_by_admin',
                title: 'Pengajuan Dibatalkan Sistem',
                message: 'Mohon maaf, barang "' . $item->title . '" telah dihapus oleh Admin. Pengajuan kamu otomatis dibatalkan.'
            );
        }

        // 3. Hapus semua foto dari storage
        foreach ($item->images ?? [] as $path) {
            $this->uploadService->delete($path);
        }

        // 4. Hapus Item (Otomatis MySQL akan men-CASCADE requests & shipments)
        $item->delete();

        return response()->json([
            'code'    => 200,
            'status'  => 'success',
            'message' => 'Item berhasil dihapus dan notifikasi pembatalan telah dikirim.',
        ], 200);
    }

    /**
     * GET /api/admin/requests
     * Monitor semua request di platform.
     */
    public function allRequests(Request $request): JsonResponse
    {
        $request->validate([
            'status'   => ['nullable', 'in:pending,approved,rejected,cancelled'],
            'item_id'  => ['nullable', 'integer'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $requests = ItemRequest::with(['item', 'requester'])
            ->when($request->status,  fn($q, $v) => $q->where('status', $v))
            ->when($request->item_id, fn($q, $v) => $q->where('item_id', $v))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'code'   => 200,
            'status' => 'success',
            'data'   => [
                'requests' => RequestResource::collection($requests),
                'meta'     => [
                    'total'        => $requests->total(),
                    'per_page'     => $requests->perPage(),
                    'current_page' => $requests->currentPage(),
                    'last_page'    => $requests->lastPage(),
                ],
            ]
        ], 200);
    }

    /**
     * GET /api/admin/shipments
     * Monitor semua pengiriman di platform.
     */
    public function allShipments(Request $request): JsonResponse
    {
        $request->validate([
            'status'   => ['nullable', 'in:preparing,in_transit,delivered'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $shipments = Shipment::with(['request.item', 'request.requester'])
            ->when($request->status, fn($q, $v) => $q->where('status', $v))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'code'   => 200,
            'status' => 'success',
            'data'   => [
                'shipments' => ShipmentResource::collection($shipments),
                'meta'      => [
                    'total'        => $shipments->total(),
                    'per_page'     => $shipments->perPage(),
                    'current_page' => $shipments->currentPage(),
                    'last_page'    => $shipments->lastPage(),
                ],
            ]
        ], 200);
    }

    /**
     * GET /api/admin/notifications
     * Pantau semua notifikasi platform dengan filter.
     */
    public function adminNotifications(Request $request): JsonResponse
    {
        $request->validate([
            'user_id'  => ['nullable', 'integer'],
            'type'     => ['nullable', 'string'],
            'search'   => ['nullable', 'string', 'max:100'],
            'is_read'  => ['nullable', 'in:0,1,true,false'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $notifications = Notification::with('user:id,name,email,username')
            ->when($request->user_id, fn($q, $v) => $q->where('user_id', $v))
            ->when($request->type,    fn($q, $v) => $q->where('type', $v))
            ->when($request->search, function ($q, $search) {
                $q->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('message', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%")
                                ->orWhere('username', 'like', "%{$search}%");
                        });
                });
            })
            ->when(
                $request->filled('is_read'),
                fn($q) => $q->where('is_read', $request->boolean('is_read'))
            )
            ->latest()
            ->paginate($request->per_page ?? 20);

        return response()->json([
            'code'   => 200,
            'status' => 'success',
            'data'   => [
                'notifications' => $notifications->map(fn($n) => [
                    'id'         => $n->id,
                    'user'       => $n->user ? [
                        'id'       => $n->user->id,
                        'name'     => $n->user->name,
                        'email'    => $n->user->email,
                        'username' => $n->user->username,
                    ] : null,
                    'title'      => $n->title,
                    'message'    => $n->message,
                    'type'       => $n->type,
                    'related_id' => $n->related_id,
                    'is_read'    => (bool) $n->is_read,
                    'created_at' => $n->created_at?->toISOString(),
                ]),
                'meta' => [
                    'total'        => $notifications->total(),
                    'per_page'     => $notifications->perPage(),
                    'current_page' => $notifications->currentPage(),
                    'last_page'    => $notifications->lastPage(),
                ],
            ]
        ], 200);
    }

    /**
     * POST /api/admin/notifications/send
     * Kirim notifikasi manual ke satu user spesifik.
     */
    public function sendNotification(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => ['required', 'integer'],
            'title'   => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        $user = User::find($request->user_id);

        if (!$user) {
            return $this->errorResponse('User tidak ditemukan.', 404);
        }

        $this->notifService->send(
            userId: $user->id,
            type: 'manual',
            title: $request->title,
            message: $request->message,
            relatedId: null,
        );

        return response()->json([
            'code'    => 200,
            'status'  => 'success',
            'message' => 'Notifikasi berhasil dikirim ke ' . $user->name . '.',
        ], 200);
    }

    /**
     * POST /api/admin/notifications/broadcast
     * Broadcast notifikasi ke semua user, atau filter by peran.
     *
     * target: 'all'       → semua user terdaftar
     * target: 'donor'     → user yang punya minimal 1 item
     * target: 'requester' → user yang pernah buat request
     */
    public function broadcastNotification(Request $request): JsonResponse
    {
        $request->validate([
            'target'  => ['required', 'in:all,donor,requester'],
            'title'   => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        // Tentukan target user berdasarkan peran
        $userIds = match ($request->target) {

            'donor' => User::whereHas('donatedItems')->pluck('id'),
            'requester' => User::whereHas('itemRequests')->pluck('id'),
            default => User::where('role', 'user')
                ->where('is_active', true)
                ->pluck('id'),
        };

        if ($userIds->isEmpty()) {
            return $this->errorResponse('Tidak ada user yang sesuai target.', 422);
        }

        // Bulk insert — lebih efisien daripada loop NotificationService
        $now           = Carbon::now();
        $notifications = $userIds->map(fn($id) => [
            'user_id'    => $id,
            'type'       => 'announcement',
            'title'      => $request->title,
            'message'    => $request->message,
            'related_id' => null,
            'is_read'    => false,
            'created_at' => $now,
            'updated_at' => $now,
        ])->toArray();

        Notification::insert($notifications);

        $targetLabel = match ($request->target) {
            'donor'     => 'semua donatur',
            'requester' => 'semua penerima',
            default     => 'semua user',
        };

        return response()->json([
            'code'    => 200,
            'status'  => 'success',
            'message' => 'Broadcast berhasil dikirim ke ' . count($notifications) . ' ' . $targetLabel . '.',
            'data'    => [
                'total_sent' => count($notifications),
                'target'     => $request->target,
            ]
        ], 200);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Resources\RequestResource;
use App\Models\Item;
use App\Models\Request as ItemRequest;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RequestController extends Controller
{
    // Inject NotificationService melalui constructor
    public function __construct(protected NotificationService $notifService) {}

    /**
     * GET /api/requests
     * Requester lihat semua request yang pernah dia buat.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status'   => ['nullable', 'in:pending,approved,rejected,cancelled'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $requests = ItemRequest::with(['item.category', 'item.donor'])
            ->where('requester_id', $request->user()->id)
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate($request->per_page ?? 10);

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
     * GET /api/requests/incoming
     * Donatur lihat semua request yang masuk ke item miliknya.
     */
    public function incoming(Request $request): JsonResponse
    {
        $request->validate([
            'status'   => ['nullable', 'in:pending,approved,rejected,cancelled'],
            'item_id'  => ['nullable', 'integer'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $requests = ItemRequest::with(['item', 'requester'])
            ->whereHas('item', fn($q) => $q->where('donor_id', $request->user()->id))
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->item_id, fn($q, $itemId) => $q->where('item_id', $itemId))
            ->latest()
            ->paginate($request->per_page ?? 10);

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
     * GET /api/requests/{id}
     * Detail satu request — requester atau donatur item tersebut.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $itemRequest = ItemRequest::with(['item.category', 'item.donor', 'requester', 'shipment'])
            ->find($id);

        if (!$itemRequest) {
            return $this->errorResponse('Request tidak ditemukan.', 404);
        }

        $user = $request->user();

        // Hanya requester atau donatur item yang boleh lihat detail
        $isRequester = $itemRequest->requester_id === $user->id;
        $isDonor     = $itemRequest->item?->donor_id === $user->id;

        if (!$isRequester && !$isDonor) {
            return $this->errorResponse('Akses ditolak. Kamu tidak punya akses ke request ini.', 403);
        }

        return response()->json([
            'code'   => 200,
            'status' => 'success',
            'data'   => [
                'request' => new RequestResource($itemRequest),
            ]
        ], 200);
    }

    /**
     * POST /api/requests
     * Penerima ajukan request ke sebuah item.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'item_id'          => ['required', 'integer'],
            'purpose'          => ['required', 'string'],
            'urgency_level'    => ['required', 'in:rendah,sedang,tinggi'],
            'delivery_address' => ['required', 'string'],
            'recipient_phone'  => ['required', 'string', 'max:20'],
        ]);

        $item = Item::find($request->item_id);

        if (!$item) {
            return $this->errorResponse('Item tidak ditemukan.', 404);
        }

        if ($item->donor_id === $request->user()->id) {
            return $this->errorResponse('Kamu tidak bisa mengajukan request untuk item milikmu sendiri.', 422);
        }

        if ($item->status !== 'available') {
            return $this->errorResponse('Item ini sudah tidak tersedia untuk direquest.', 422);
        }

        // Cek apakah sudah punya request aktif (pending/approved) untuk item ini
        $activeRequest = ItemRequest::where('item_id', $item->id)
            ->where('requester_id', $request->user()->id)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($activeRequest) {
            return $this->errorResponse('Kamu sudah punya request aktif untuk item ini.', 422);
        }

        $itemRequest = ItemRequest::create([
            'item_id'          => $item->id,
            'requester_id'     => $request->user()->id,
            'purpose'          => $request->purpose,
            'urgency_level'    => $request->urgency_level,
            'delivery_address' => $request->delivery_address,
            'recipient_phone'  => $request->recipient_phone,
            'status'           => 'pending',
        ]);

        // trigger: notifikasi ke donatur bahwa ada request masuk
        if ($itemRequest->item?->donor_id) {
            $this->notifService->send(
                userId: $itemRequest->item->donor_id,
                type: 'new_request',
                title: 'Ada Request Masuk!',
                message: $request->user()->name . ' mengajukan request untuk item "' . $itemRequest->item->title . '".',
                relatedId: $itemRequest->id,
            );
        }

        return response()->json([
            'code'    => 201,
            'status'  => 'success',
            'message' => 'Request berhasil diajukan. Tunggu konfirmasi dari donatur.',
            'data'    => [
                'request' => new RequestResource($itemRequest->load(['item', 'requester'])),
            ]
        ], 201);
    }

    /**
     * PUT /api/requests/{id}/approve
     * Donatur approve request — item jadi reserved,
     * request lain yang pending untuk item ini otomatis ditolak.
     */
    public function approve(Request $request, string $id): JsonResponse
    {
        $itemRequest = ItemRequest::with('item')->find($id);

        if (!$itemRequest) {
            return $this->errorResponse('Request tidak ditemukan.', 404);
        }

        if ($itemRequest->item?->donor_id !== $request->user()->id) {
            return $this->errorResponse('Akses ditolak. Kamu bukan donatur item ini.', 403);
        }

        if ($itemRequest->status !== 'pending') {
            return $this->errorResponse('Hanya request dengan status pending yang bisa di-approve.', 422);
        }

        // Approve request ini
        $itemRequest->update(['status' => 'approved']);

        // Item jadi reserved
        $itemRequest->item->update(['status' => 'reserved']);

        // Tolak otomatis semua request pending lain untuk item yang sama
        ItemRequest::where('item_id', $itemRequest->item_id)
            ->where('id', '!=', $itemRequest->id)
            ->where('status', 'pending')
            ->update([
                'status'           => 'rejected',
                'rejection_reason' => 'Request lain untuk item ini telah disetujui oleh donatur.',
            ]);

        // trigger: notifikasi ke requester bahwa request disetujui
        if ($itemRequest->requester_id) {
            $this->notifService->send(
                userId: $itemRequest->requester_id,
                type: 'request_approved',
                title: 'Request Kamu Disetujui!',
                message: 'Donatur menyetujui request kamu untuk item "' . $itemRequest->item->title . '". Tunggu info pengiriman.',
                relatedId: $itemRequest->id,
            );
        }

        return response()->json([
            'code'    => 200,
            'status'  => 'success',
            'message' => 'Request berhasil disetujui.',
            'data'    => [
                'request' => new RequestResource($itemRequest->load(['item', 'requester'])),
            ]
        ], 200);
    }

    /**
     * PUT /api/requests/{id}/reject
     * Donatur tolak request dengan alasan.
     */
    public function reject(Request $request, string $id): JsonResponse
    {
        $itemRequest = ItemRequest::with('item')->find($id);

        if (!$itemRequest) {
            return $this->errorResponse('Request tidak ditemukan.', 404);
        }

        if ($itemRequest->item?->donor_id !== $request->user()->id) {
            return $this->errorResponse('Akses ditolak. Kamu bukan donatur item ini.', 403);
        }

        if ($itemRequest->status !== 'pending') {
            return $this->errorResponse('Hanya request dengan status pending yang bisa ditolak.', 422);
        }

        $request->validate([
            'rejection_reason' => ['required', 'string'],
        ]);

        $itemRequest->update([
            'status'           => 'rejected',
            'rejection_reason' => $request->rejection_reason,
        ]);

        // trigger: notifikasi ke requester bahwa request ditolak
        if ($itemRequest->requester_id) {
            $this->notifService->send(
                userId: $itemRequest->requester_id,
                type: 'request_rejected',
                title: 'Request Kamu Ditolak',
                message: 'Maaf, donatur menolak request kamu untuk item "' . $itemRequest->item->title . '". Alasan: ' . $request->rejection_reason,
                relatedId: $itemRequest->id,
            );
        }

        return response()->json([
            'code'    => 200,
            'status'  => 'success',
            'message' => 'Request berhasil ditolak.',
            'data'    => [
                'request' => new RequestResource($itemRequest->load(['item', 'requester'])),
            ]
        ], 200);
    }

    /**
     * PUT /api/requests/{id}/cancel
     * Requester batalkan request miliknya sendiri.
     * Jika request sudah approved → item kembali ke available.
     */
    public function cancel(Request $request, string $id): JsonResponse
    {
        $itemRequest = ItemRequest::with('item')->find($id);

        if (!$itemRequest) {
            return $this->errorResponse('Request tidak ditemukan.', 404);
        }

        if ($itemRequest->requester_id !== $request->user()->id) {
            return $this->errorResponse('Akses ditolak. Kamu bukan pemilik request ini.', 403);
        }

        if (in_array($itemRequest->status, ['rejected', 'cancelled'])) {
            return $this->errorResponse('Request ini sudah ' . $itemRequest->status . ' dan tidak bisa dibatalkan.', 422);
        }

        // Kalau cancel setelah approved → kembalikan item ke available
        if ($itemRequest->status === 'approved') {
            $hasShipment = $itemRequest->shipment()->exists();

            if ($hasShipment) {
                return $this->errorResponse(
                    'Request tidak bisa dibatalkan karena donatur sudah memproses pengiriman.',
                    422
                );
            }

            $itemRequest->item?->update(['status' => 'available']);
        }

        $itemRequest->update(['status' => 'cancelled']);

        return response()->json([
            'code'    => 200,
            'status'  => 'success',
            'message' => 'Request berhasil dibatalkan.',
            'data'    => [
                'request' => new RequestResource($itemRequest->load(['item'])),
            ]
        ], 200);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * GET /api/notifications
     * List semua notifikasi milik user yang login.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'is_read'  => ['nullable', 'in:0,1,true,false'],    
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $user = $request->user();

        $notifications = Notification::where('user_id', $user->id)
            ->when(
                $request->filled('is_read'),
                fn($q) => $q->where('is_read', $request->boolean('is_read'))
            )
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'code'   => 200,
            'status' => 'success',
            'data'   => [
                'notifications' => NotificationResource::collection($notifications),
                'meta'          => [
                    'total'        => $notifications->total(),
                    'per_page'     => $notifications->perPage(),
                    'current_page' => $notifications->currentPage(),
                    'last_page'    => $notifications->lastPage(),
                    'unread_count' => Notification::where('user_id', $user->id)
                        ->where('is_read', false)
                        ->count(),
                ],
            ]
        ], 200);
    }

    /**
     * GET /api/notifications/unread-count
     * Jumlah notifikasi belum dibaca — untuk badge di FE.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $count = Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'code'   => 200,
            'status' => 'success',
            'data'   => [
                'unread_count' => $count,
            ]
        ], 200);
    }

    /**
     * PUT /api/notifications/{id}/read
     * Tandai satu notifikasi sebagai sudah dibaca.
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        // Langsung filter berdasarkan user_id agar user tidak bisa membaca notifikasi orang lain
        $notification = Notification::where('user_id', $request->user()->id)->find($id);

        if (!$notification) {
            return $this->errorResponse('Notifikasi tidak ditemukan.', 404);
        }

        $notification->update(['is_read' => true]);

        return response()->json([
            'code'    => 200,
            'status'  => 'success',
            'message' => 'Notifikasi ditandai sudah dibaca.',
            'data'    => [
                'notification' => new NotificationResource($notification),
            ]
        ], 200);
    }

    /**
     * PUT /api/notifications/read-all
     * Tandai semua notifikasi milik user sebagai sudah dibaca.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'code'    => 200,
            'status'  => 'success',
            'message' => 'Semua notifikasi telah ditandai sudah dibaca.',
        ], 200);
    }
}

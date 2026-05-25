<?php

namespace App\Http\Controllers;

use App\Http\Resources\ShipmentResource;
use App\Models\Request as ItemRequest;
use App\Models\Shipment;
use App\Services\FileUploadService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShipmentController extends Controller
{
    // Inject FileUploadService dan NotificationService melalui constructor
    public function __construct(
        protected FileUploadService   $uploadService,
        protected NotificationService $notifService,
    ) {}

    /**
     * GET /api/shipments
     * Lihat semua pengiriman yang melibatkan user yang sedang login
     * (Baik sebagai donatur/pengirim, maupun sebagai penerima).
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status'   => ['nullable', 'in:preparing,in_transit,delivered'],
            'as'       => ['nullable', 'in:donor,requester'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $user = $request->user();

        $shipments = Shipment::with(['request.item.donor', 'request.requester'])
            ->whereHas('request', function ($query) use ($user, $request) {

                // Jika frontend secara spesifik minta data sebagai donatur
                if ($request->as === 'donor') {
                    $query->whereHas('item', fn($q) => $q->where('donor_id', $user->id));
                }
                // Jika frontend secara spesifik minta data sebagai penerima
                elseif ($request->as === 'requester') {
                    $query->where('requester_id', $user->id);
                }
                // Jika tidak ada filter, gabungkan dua-duanya (Semua riwayat logistik dia)
                else {
                    $query->where('requester_id', $user->id)
                        ->orWhereHas('item', fn($q) => $q->where('donor_id', $user->id));
                }
            })
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate($request->per_page ?? 10);

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

    // =========================================================================
    // FEAT/SHIPMENT-MANAGE
    // =========================================================================

    /**
     * GET /api/shipments/{id}
     * Detail shipment — donatur atau requester terkait.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $shipment = Shipment::with([
            'request.item.donor',
            'request.requester',
        ])->find($id);

        if (!$shipment) {
            return $this->errorResponse('Shipment tidak ditemukan.', 404);
        }

        $user        = $request->user();
        $isDonor     = $shipment->request?->item?->donor_id === $user->id;
        $isRequester = $shipment->request?->requester_id === $user->id;
        $isAdmin     = $user->role === 'admin';

        if (!$isDonor && !$isRequester && !$isAdmin) {
            return $this->errorResponse('Akses ditolak. Kamu tidak punya akses ke shipment ini.', 403);
        }

        return response()->json([
            'code'   => 200,
            'status' => 'success',
            'data'   => [
                'shipment' => new ShipmentResource($shipment),
            ]
        ], 200);
    }

    /**
     * POST /api/shipments
     * Donatur buat data pengiriman setelah request di-approve.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'request_id'      => ['required', 'integer'],
            'courier'         => ['required', 'string', 'max:50'],
            'tracking_number' => ['required', 'string', 'max:100'],
            'cod_amount'      => ['nullable', 'numeric', 'min:0'],
        ]);

        $itemRequest = ItemRequest::with('item')->find($request->request_id);

        if (!$itemRequest) {
            return $this->errorResponse('Request tidak ditemukan.', 404);
        }

        // Pastikan donatur yang login adalah pemilik item
        if ($itemRequest->item?->donor_id !== $request->user()->id) {
            return $this->errorResponse('Akses ditolak. Kamu bukan donatur item ini.', 403);
        }

        // Request harus sudah approved
        if ($itemRequest->status !== 'approved') {
            return $this->errorResponse('Pengiriman hanya bisa dibuat untuk request yang sudah disetujui.', 422);
        }

        // Cegah duplikat shipment untuk request yang sama
        $existingShipment = Shipment::where('request_id', $itemRequest->id)->first();

        if ($existingShipment) {
            return $this->errorResponse('Shipment untuk request ini sudah pernah dibuat.', 422);
        }

        $shipment = Shipment::create([
            'request_id'      => $itemRequest->id,
            'courier'         => $request->courier,
            'tracking_number' => $request->tracking_number,
            'cod_amount'      => $request->cod_amount,
            'status'          => 'preparing',
        ]);

        return response()->json([
            'code'    => 201,
            'status'  => 'success',
            'message' => 'Data pengiriman berhasil dibuat.',
            'data'    => [
                'shipment' => new ShipmentResource($shipment->load('request.item')),
            ]
        ], 201);
    }

    /**
     * PUT /api/shipments/{id}/status
     * Donatur update status pengiriman secara berurutan.
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $shipment = Shipment::with('request.item')->find($id);

        if (!$shipment) {
            return $this->errorResponse('Shipment tidak ditemukan.', 404);
        }

        if ($shipment->request?->item?->donor_id !== $request->user()->id) {
            return $this->errorResponse('Akses ditolak. Kamu bukan donatur dari pengiriman ini.', 403);
        }

        // Tentukan status berikutnya berdasarkan status saat ini
        $nextStatus = match ($shipment->status) {
            'preparing'  => 'in_transit',
            'in_transit' => 'delivered',
            default      => null,
        };

        if (!$nextStatus) {
            return $this->errorResponse('Status pengiriman sudah final (delivered) dan tidak bisa diubah lagi.', 422);
        }

        $updateData = ['status' => $nextStatus];

        // Set timestamp sesuai transisi status
        if ($nextStatus === 'in_transit') {
            $updateData['shipped_at'] = now();
        }

        $shipment->update($updateData);

        // trigger: notif saat barang mulai dikirim
        if ($nextStatus === 'in_transit' && $shipment->request?->requester_id) {
            $this->notifService->send(
                userId: $shipment->request->requester_id,
                type: 'item_shipped',
                title: 'Barang Sedang Dikirim!',
                message: 'Barang kamu sedang dalam perjalanan. No. resi: ' . $shipment->tracking_number . ' via ' . $shipment->courier . '.',
                relatedId: $shipment->id,
            );
        }

        // trigger: notif saat barang sudah delivered
        if ($nextStatus === 'delivered' && $shipment->request?->requester_id) {
            $this->notifService->send(
                userId: $shipment->request->requester_id,
                type: 'item_delivered',
                title: 'Barang Telah Tiba!',
                message: 'Donatur menyatakan barang sudah dikirim. Konfirmasi penerimaan jika barang sudah di tanganmu.',
                relatedId: $shipment->id,
            );
        }

        return response()->json([
            'code'    => 200,
            'status'  => 'success',
            'message' => 'Status pengiriman diperbarui menjadi ' . $nextStatus . '.',
            'data'    => [
                'shipment' => new ShipmentResource($shipment->load('request.item')),
            ]
        ], 200);
    }

    /**
     * POST /api/shipments/{id}/confirm-received
     * Requester konfirmasi barang sudah diterima.
     * Item resmi jadi 'donated'. Feedback tetap opsional dan terpisah.
     */
    public function confirmReceived(Request $request, string $id): JsonResponse
    {
        $shipment = Shipment::with('request.item')->find($id);

        if (!$shipment) {
            return $this->errorResponse('Shipment tidak ditemukan.', 404);
        }

        // Hanya requester yang boleh konfirmasi
        if ($shipment->request?->requester_id !== $request->user()->id) {
            return $this->errorResponse(
                'Akses ditolak. Kamu bukan penerima barang dari pengiriman ini.',
                403
            );
        }

        // Shipment harus sudah in_transit oleh donatur dulu
        if ($shipment->status === 'preparing') {
            return $this->errorResponse(
                'Konfirmasi belum bisa dilakukan karena barang belum dikirim.',
                422
            );
        }

        // Cegah konfirmasi ganda — pakai delivered_at sebagai penanda
        if ($shipment->delivered_at !== null) {
            return $this->errorResponse(
                'Kamu sudah mengkonfirmasi penerimaan barang ini.',
                422
            );
        }

        $shipment->update([
            'status'       => 'delivered',
            'delivered_at' => now()
        ]);

        // Item resmi donated setelah dikonfirmasi penerima
        $shipment->request?->item?->update(['status' => 'donated']);

        if ($shipment->request?->item?->donor_id) {
            $this->notifService->send(
                userId: $shipment->request->item->donor_id,
                type: 'item_received',
                title: 'Barang Sudah Diterima!',
                message: 'Penerima mengkonfirmasi barang "' . $shipment->request->item->title . '" sudah diterima. Donasi kamu berhasil!',
                relatedId: $shipment->id,
            );
        }

        return response()->json([
            'code'    => 200,
            'status'  => 'success',
            'message' => 'Penerimaan barang berhasil dikonfirmasi. Terima kasih!',
            'data'    => [
                'shipment' => new ShipmentResource($shipment->fresh()->load('request.item')),
            ]
        ], 200);
    }

    // =========================================================================
    // FEAT/SHIPMENT-FEEDBACK
    // =========================================================================

    /**
     * POST /api/shipments/{id}/feedback
     * Requester konfirmasi terima barang, kasih rating & foto bukti.
     */
    public function submitFeedback(Request $request, string $id): JsonResponse
    {
        $shipment = Shipment::with('request')->find($id);

        if (!$shipment) {
            return $this->errorResponse('Shipment tidak ditemukan.', 404);
        }

        if ($shipment->request?->requester_id !== $request->user()->id) {
            return $this->errorResponse('Akses ditolak. Kamu bukan penerima barang dari pengiriman ini.', 403);
        }

        if ($shipment->status !== 'delivered') {
            return $this->errorResponse('Feedback hanya bisa diberikan setelah barang berstatus delivered.', 422);
        }

        // Cegah submit feedback lebih dari sekali
        if ($shipment->rating !== null) {
            return $this->errorResponse('Kamu sudah pernah memberikan feedback untuk pengiriman ini.', 422);
        }

        // Validasi diletakkan DI BAWAH pengecekan akses untuk optimasi beban server
        $request->validate([
            'rating'           => ['required', 'integer', 'min:1', 'max:5'],
            'feedback_message' => ['nullable', 'string'],
            'feedback_images'  => ['nullable', 'array', 'max:5'],
            'feedback_images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ], [
            'rating.min'              => 'Rating minimal 1 bintang.',
            'rating.max'              => 'Rating maksimal 5 bintang.',
            'feedback_images.max'     => 'Maksimal 5 foto bukti.',
            'feedback_images.*.image' => 'Semua file harus berupa gambar.',
            'feedback_images.*.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'feedback_images.*.max'   => 'Ukuran tiap foto maksimal 2MB.',
        ]);

        // Upload foto bukti kalau ada
        $feedbackImagePaths = [];
        if ($request->hasFile('feedback_images')) {
            $feedbackImagePaths = $this->uploadService->uploadMany(
                $request->file('feedback_images'),
                'uploads/feedback'
            );
        }

        $shipment->update([
            'rating'           => $request->rating,
            'feedback_message' => $request->feedback_message,
            'feedback_images'  => !empty($feedbackImagePaths) ? $feedbackImagePaths : null,
        ]);

        return response()->json([
            'code'    => 200,
            'status'  => 'success',
            'message' => 'Terima kasih! Feedback kamu berhasil disimpan.',
            'data'    => [
                'shipment' => new ShipmentResource($shipment->load('request')),
            ]
        ], 200);
    }

    /**
     * PUT /api/shipments/{id}/feedback
     * Requester mengubah/mengedit feedback yang sudah pernah dikirim.
     */
    public function updateFeedback(Request $request, string $id): JsonResponse
    {
        $shipment = Shipment::with('request')->find($id);

        if (!$shipment) {
            return $this->errorResponse('Shipment tidak ditemukan.', 404);
        }

        // Hanya requester asli yang boleh mengedit feedback
        if ($shipment->request?->requester_id !== $request->user()->id) {
            return $this->errorResponse('Akses ditolak. Kamu bukan penerima barang dari pengiriman ini.', 403);
        }

        if ($shipment->status !== 'delivered') {
            return $this->errorResponse('Feedback hanya bisa diubah jika status barang sudah delivered.', 422);
        }

        // Validasi: pastikan dia memang sudah pernah submit feedback sebelumnya
        if ($shipment->rating === null) {
            return $this->errorResponse('Kamu belum pernah memberikan feedback untuk pengiriman ini. Gunakan metode POST untuk mengirim pertama kali.', 422);
        }

        $request->validate([
            'rating'           => ['required', 'integer', 'min:1', 'max:5'],
            'feedback_message' => ['nullable', 'string'],
            'feedback_images'  => ['nullable', 'array', 'max:5'],
            'feedback_images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ], [
            'rating.min'              => 'Rating minimal 1 bintang.',
            'rating.max'              => 'Rating maksimal 5 bintang.',
            'feedback_images.max'     => 'Maksimal 5 foto bukti.',
            'feedback_images.*.image' => 'Semua file harus berupa gambar.',
            'feedback_images.*.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'feedback_images.*.max'   => 'Ukuran tiap foto maksimal 2MB.',
        ]);

        $feedbackImagePaths = $shipment->feedback_images ?? [];

        // Jika user mengupload foto bukti baru, hapus semua foto bukti lama dari storage
        if ($request->hasFile('feedback_images')) {
            foreach ($shipment->feedback_images ?? [] as $oldPath) {
                $this->uploadService->delete($oldPath);
            }

            $feedbackImagePaths = $this->uploadService->uploadMany(
                $request->file('feedback_images'),
                'uploads/feedback'
            );
        }

        $shipment->update([
            'rating'           => $request->rating,
            'feedback_message' => $request->feedback_message,
            'feedback_images'  => !empty($feedbackImagePaths) ? $feedbackImagePaths : null,
        ]);

        return response()->json([
            'code'    => 200,
            'status'  => 'success',
            'message' => 'Feedback berhasil diperbarui.',
            'data'    => [
                'shipment' => new ShipmentResource($shipment->load('request')),
            ]
        ], 200);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Resources\ItemResource;
use App\Models\Item;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function __construct(protected FileUploadService $uploadService) {}

    /**
     * GET /api/items
     * List semua item available — publik, dengan filter & pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'search'      => ['nullable', 'string', 'max:100'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'condition'   => ['nullable', 'in:baru,seperti baru,layak pakai'], 
            'status'      => ['nullable', 'in:available,reserved,donated'],
            'location'    => ['nullable', 'string', 'max:100'],
            'per_page'    => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $items = Item::with(['donor', 'category'])
            ->withCount('requests')
            ->when($request->search, fn($q, $search) =>
                $q->where('title', 'like', "%{$search}%")
            )
            ->when($request->category_id, fn($q, $id) =>
                $q->where('category_id', $id)
            )
            ->when($request->condition, fn($q, $condition) =>
                $q->where('condition', $condition)
            )
            ->when($request->location, fn($q, $location) =>
                $q->where('location', 'like', "%{$location}%")
            )
            ->when($request->status, fn($q, $status) =>
                $q->where('status', $status),
                // default tampilkan available saja kalau tidak ada filter status
                fn($q) => $q->where('status', 'available')
            )
            ->latest()
            ->paginate($request->per_page ?? 12);

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
     * GET /api/items/{id}
     * Detail satu item — publik.
     */
    public function show(string $id): JsonResponse
    {
        $item = Item::with(['donor', 'category'])
            ->withCount('requests')
            ->find($id);

        if (!$item) {
            return $this->errorResponse('Item tidak ditemukan.', 404);
        }

        return response()->json([
            'code'   => 200,
            'status' => 'success',
            'data'   => [
                'item' => new ItemResource($item),
            ]
        ], 200);
    }

    /**
     * GET /api/user/items
     * List item milik donatur yang sedang login.
     */
    public function myItems(Request $request): JsonResponse
    {
        $request->validate([
            'status'   => ['nullable', 'in:available,reserved,donated'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $items = Item::with(['category'])
            ->withCount('requests')
            ->where('donor_id', $request->user()->id)
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate($request->per_page ?? 12);

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
     * POST /api/items
     * Donatur posting item baru.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title'         => ['required', 'string', 'max:255'],
            'description'   => ['required', 'string'],
            'condition'     => ['required', 'in:baru,seperti baru,layak pakai'],
            'location'      => ['required', 'string', 'max:100'],
            'shipping_type' => ['required', 'in:free,paid'],
            'category_id'   => ['required', 'integer', 'exists:categories,id'],
            'images'        => ['required', 'array', 'min:1', 'max:5'],
            'images.*'      => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ], [
            'images.required'    => 'Minimal upload 1 foto.',
            'images.max'         => 'Maksimal 5 foto.',
            'images.*.image'     => 'Semua file harus berupa gambar.',
            'images.*.mimes'     => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'images.*.max'       => 'Ukuran tiap foto maksimal 2MB.',
            'category_id.exists' => 'Kategori tidak ditemukan.',
        ]);

        $imagePaths = $this->uploadService->uploadMany(
            $request->file('images'),
            'uploads/items'
        );

        $item = Item::create([
            'title'         => $request->title,
            'description'   => $request->description,
            'condition'     => $request->condition,
            'location'      => $request->location,
            'shipping_type' => $request->shipping_type,
            'category_id'   => $request->category_id,
            'donor_id'      => $request->user()->id,
            'images'        => $imagePaths, 
            'status'        => 'available',
        ]);

        return response()->json([
            'code'    => 201,
            'status'  => 'success',
            'message' => 'Item berhasil diposting.',
            'data'    => [
                'item' => new ItemResource($item->load(['donor', 'category'])),
            ]
        ], 201);
    }

    /**
     * PUT /api/items/{id}
     * Update item — hanya pemilik (donor_id).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $item = Item::find($id);

        if (!$item) {
            return $this->errorResponse('Item tidak ditemukan.', 404);
        }

        if ($item->donor_id !== $request->user()->id) {
            return $this->errorResponse('Akses ditolak. Kamu bukan pemilik item ini.', 403);
        }

        if (in_array($item->status, ['reserved', 'donated'])) {
            return $this->errorResponse('Item tidak bisa diedit karena sudah ada request aktif atau sudah didonasikan.', 422);
        }

        $request->validate([
            'title'         => ['sometimes', 'string', 'max:255'],
            'description'   => ['sometimes', 'string'],
            'condition'     => ['sometimes', 'in:baru,seperti baru,layak pakai'],
            'location'      => ['sometimes', 'string', 'max:100'],
            'shipping_type' => ['sometimes', 'in:free,paid'], 
            'category_id'   => ['sometimes', 'integer', 'exists:categories,id'],
        ]);

        $item->update($request->only([
            'title', 'description', 'condition',
            'location', 'shipping_type', 'category_id',
        ]));

        return response()->json([
            'code'    => 200,
            'status'  => 'success',
            'message' => 'Item berhasil diperbarui.',
            'data'    => [
                'item' => new ItemResource($item->load(['donor', 'category'])),
            ]
        ], 200);
    }

    /**
     * POST /api/items/{id}/images
     * Ganti semua foto item — hanya pemilik.
     */
    public function updateImages(Request $request, string $id): JsonResponse
    {
        $item = Item::find($id);

        if (!$item) {
            return $this->errorResponse('Item tidak ditemukan.', 404);
        }

        if ($item->donor_id !== $request->user()->id) {
            return $this->errorResponse('Akses ditolak. Kamu bukan pemilik item ini.', 403);
        }

        if (in_array($item->status, ['reserved', 'donated'])) {
            return $this->errorResponse('Foto tidak bisa diubah karena item sudah ada request aktif.', 422);
        }

        $request->validate([
            'images'   => ['required', 'array', 'min:1', 'max:5'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ], [
            'images.required' => 'Minimal upload 1 foto.',
            'images.max'      => 'Maksimal 5 foto.',
        ]);

        // Hapus semua foto lama
        foreach ($item->images ?? [] as $oldPath) {
            $this->uploadService->delete($oldPath); 
        }

        $imagePaths = $this->uploadService->uploadMany(
            $request->file('images'),
            'uploads/items'
        );

        $item->update(['images' => $imagePaths]);

        return response()->json([
            'code'    => 200,
            'status'  => 'success',
            'message' => 'Foto item berhasil diperbarui.',
            'data'    => [
                'images' => collect($imagePaths)->map(fn($path) => asset('storage/' . $path))->values(),
            ]
        ], 200);
    }

    /**
     * DELETE /api/items/{id}
     * Hapus item — hanya pemilik.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $item = Item::find($id);

        if (!$item) {
            return $this->errorResponse('Item tidak ditemukan.', 404);
        }

        if ($item->donor_id !== $request->user()->id) {
            return $this->errorResponse('Akses ditolak. Kamu bukan pemilik item ini.', 403);
        }

        if ($item->status === 'reserved') {
            return $this->errorResponse('Item tidak bisa dihapus karena sedang ada request aktif.', 422);
        }

        if ($item->status === 'donated') {
            return $this->errorResponse('Item tidak bisa dihapus karena sudah selesai didonasikan.', 422);
        }

        // Hapus semua foto dari storage sebelum delete record
        foreach ($item->images ?? [] as $path) {
            $this->uploadService->delete($path); 
        }

        $item->delete(); 

        return response()->json([
            'code'    => 200,
            'status'  => 'success',
            'message' => 'Item berhasil dihapus.',
        ], 200);
    }

    /**
     * Helper internal untuk format error response
     */
    private function errorResponse(string $message, int $code): JsonResponse
    {
        return response()->json([
            'code'    => $code,
            'status'  => 'error',
            'message' => $message,
        ], $code);
    }
}
<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * GET /api/categories
     * List semua kategori — publik.
     */
    public function index(): JsonResponse
    {
        $categories = Category::withCount([
            'items' => fn($q) => $q->where('status', 'available'),
        ])
        ->orderBy('name')
        ->get();

        return response()->json([
            'code' => 200,
            'status' => 'success',

            'data' => [
                'categories' => CategoryResource::collection($categories),
            ],
        ], 200);
    }

    /**
     * GET /api/categories/{id}
     * Detail kategori.
     */
    public function show(string $id): JsonResponse
    {
        try {

            $category = Category::withCount([
                'items' => fn($q) => $q->where('status', 'available'),
            ])->findOrFail($id);

            return response()->json([
                'code' => 200,
                'status' => 'success',

                'data' => [
                    'category' => new CategoryResource($category),
                ],
            ], 200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'code' => 404,
                'status' => 'error',
                'message' => 'Kategori tidak ditemukan.',
            ], 404);
        }
    }

    /**
     * POST /api/admin/categories
     * Buat kategori baru — admin only.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                'unique:categories,name',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ], [
            'name.required' => 'Nama kategori wajib diisi.',
            'name.unique' => 'Nama kategori sudah ada.',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'code' => 201,
            'status' => 'success',
            'message' => 'Kategori berhasil dibuat.',

            'data' => [
                'category' => new CategoryResource($category),
            ],
        ], 201);
    }

    /**
     * PUT /api/admin/categories/{id}
     * Update kategori — admin only.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {

            $category = Category::findOrFail($id);

            $validated = $request->validate([
                'name' => [
                    'sometimes',
                    'string',
                    'max:100',
                    'unique:categories,name,' . $category->id,
                ],

                'description' => [
                    'nullable',
                    'string',
                ],
            ], [
                'name.unique' => 'Nama kategori sudah digunakan.',
            ]);

            $category->update($validated);

            return response()->json([
                'code' => 200,
                'status' => 'success',
                'message' => 'Kategori berhasil diperbarui.',

                'data' => [
                    'category' => new CategoryResource($category->fresh()),
                ],
            ], 200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'code' => 404,
                'status' => 'error',
                'message' => 'Kategori tidak ditemukan.',
            ], 404);
        }
    }

    /**
     * DELETE /api/admin/categories/{id}
     * Hapus kategori — admin only.
     */
    public function destroy(string $id): JsonResponse
    {
        try {

            $category = Category::findOrFail($id);

            $category->delete();

            return response()->json([
                'code' => 200,
                'status' => 'success',
                'message' => 'Kategori berhasil dihapus.',
            ], 200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'code' => 404,
                'status' => 'error',
                'message' => 'Kategori tidak ditemukan.',
            ], 404);

        } catch (QueryException $e) {

            // FK constraint
            if ($e->getCode() === '23000') {

                return response()->json([
                    'code' => 422,
                    'status' => 'error',
                    'message' => 'Kategori tidak bisa dihapus karena masih ada item di dalamnya.',
                ], 422);
            }

            throw $e;
        }
    }
}

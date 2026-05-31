<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Item;
use App\Http\Resources\UserResource;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Resources\ItemResource;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function __construct(
        protected FileUploadService $uploadService
    ) {}

    /**
     * GET /api/admin/users
     * Ambil daftar semua user.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:100',
            ],

            'role' => [
                'nullable',
                'in:user,admin',
            ],

            'is_active' => [
                'nullable',
                'in:0,1,true,false',
            ],

            'per_page' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
            ],
        ]);

        $users = User::query()

            ->when(
                $validated['search'] ?? null,
                function ($query, $search) {

                    $query->where(function ($query) use ($search) {

                        $query
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('username', 'like', "%{$search}%");
                    });
                }
            )

            ->when(
                isset($validated['role']),
                fn($query) => $query->where('role', $validated['role'])
            )

            ->when(
                isset($validated['is_active']),
                fn($query) => $query->where(
                    'is_active',
                    filter_var($validated['is_active'], FILTER_VALIDATE_BOOLEAN)
                )
            )
            ->latest()
            ->paginate($validated['per_page'] ?? 15);

        return response()->json([
            'code' => 200,
            'status' => 'success',
            'data' => [
                'users' => UserResource::collection($users),
            ],

            'meta' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ],
        ], 200);
    }

    /**
     * PUT /api/admin/users/{id}/toggle-active
     * Aktifkan / nonaktifkan akun user.
     */
    public function toggleActive(User $user, Request $request): JsonResponse
    {
        // admin tidak bisa mengubah status dirinya sendiri
        if ($user->id === $request->user()->id) {

            return response()->json([
                'code' => 422,
                'status' => 'error',
                'message' => 'Tidak bisa mengubah status akun sendiri.',
            ], 422);
        }

        // toggle status
        $user->update([
            'is_active' => ! $user->is_active,
        ]);

        // revoke token jika akun dinonaktifkan
        if (! $user->is_active) {
            $user->tokens()->delete();
        }

        return response()->json([
            'code' => 200,

            'status' => 'success',

            'message' => $user->is_active
                ? 'Akun berhasil diaktifkan.'
                : 'Akun berhasil dinonaktifkan.',

            'data' => [
                'user' => new UserResource($user->fresh()),
            ],
        ], 200);
    }

    /**
     * GET /api/users/{username}/profile
     * Lihat profil publik user — tidak butuh token.
     * Hanya tampilkan info yang aman: nama, username, bio, foto, dan item aktifnya.
     */
    public function publicProfile(string $username): JsonResponse
    {
        $user = User::where('username', $username)
            ->where('is_active', true) 
            ->first();

        if (!$user) {
            return response()->json([
                'code'    => 404,
                'status'  => 'error',
                'message' => 'Pengguna tidak ditemukan.',
            ], 404);
        }

        // Item yang boleh dilihat publik — hanya yang available
        $items = Item::with('category')
            ->where('donor_id', $user->id)
            ->where('status', 'available')
            ->latest()
            ->get();

        return response()->json([
            'code'   => 200,
            'status' => 'success',
            'data'   => [
                'user' => [
                    'username'      => $user->username,
                    'name'          => $user->name,
                    'bio'           => $user->bio,
                    'profile_photo' => $user->profile_photo
                        ? asset('storage/' . $user->profile_photo)
                        : null,
                    'member_since'  => $user->created_at?->toDateString(),
                ],
                'items' => ItemResource::collection($items),
            ]
        ], 200);
    }

    /**
     * GET /api/user/profile
     * Menampilkan profil user yang sedang login.
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'code' => 200,
            'status' => 'success',
            'data' => [
                'user' => new UserResource($request->user()),
            ],
        ], 200);
    }

    /**
     * PUT /api/user/profile
     * Update profil user.
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'username' => [
                'sometimes',
                'string',
                'max:50',
                'unique:users,username,' . $user->id,
                'regex:/^[a-z0-9_.]+$/',
            ],

            'name' => [
                'sometimes',
                'string',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:20',
            ],

            'address' => [
                'nullable',
                'string',
            ],

            'bio' => [
                'nullable',
                'string',
            ],
        ], [
            'username.unique' => 'Username sudah digunakan.',
            'username.regex' => 'Username hanya boleh huruf kecil, angka, titik, dan underscore.',
        ]);

        $user->update($validated);

        return response()->json([
            'code' => 200,
            'status' => 'success',
            'message' => 'Profil berhasil diperbarui.',
            'data' => [
                'user' => new UserResource($user->fresh()),
            ],
        ], 200);
    }

    /**
     * PUT /api/user/password
     * Mengubah password user.
     */
    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => [
                'required',
                'string',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ], [
            'password.confirmed' => 'Konfirmasi password baru tidak cocok.',
        ]);

        // validasi password lama
        if (! Hash::check($validated['current_password'], $user->password)) {

            return response()->json([
                'code' => 422,
                'status' => 'error',
                'message' => 'Password saat ini salah.',
            ], 422);
        }

        // update password
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // logout semua device/session lama
        $user->tokens()->delete();

        return response()->json([
            'code' => 200,
            'status' => 'success',
            'message' => 'Password berhasil diubah. Silakan login kembali.',
        ], 200);
    }

    /**
     * POST /api/user/photo
     * Upload atau update foto profil.
     */
    public function uploadPhoto(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'photo' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
        ], [
            'photo.image' => 'File harus berupa gambar.',
            'photo.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'photo.max' => 'Ukuran foto maksimal 2MB.',
        ]);

        $user = $request->user();

        // hapus foto lama jika ada
        if ($user->profile_photo) {
            $this->uploadService->delete($user->profile_photo);
        }

        // upload foto baru
        $path = $this->uploadService->upload(
            $validated['photo'],
            'uploads/profiles'
        );

        $user->update([
            'profile_photo' => $path,
        ]);

        return response()->json([
            'code' => 200,
            'status' => 'success',
            'message' => 'Foto profil berhasil diperbarui.',
            'data' => [
                'profile_photo' => asset('storage/' . $path),
            ],
        ], 200);
    }

    /**
     * DELETE /api/user/photo
     * Menghapus foto profil user.
     */
    public function deletePhoto(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->profile_photo) {

            return response()->json([
                'code' => 422,
                'status' => 'error',
                'message' => 'Kamu belum memiliki foto profil.',
            ], 422);
        }

        // hapus file dari storage
        $this->uploadService->delete($user->profile_photo);

        // reset kolom database
        $user->update([
            'profile_photo' => null,
        ]);

        return response()->json([
            'code' => 200,
            'status' => 'success',
            'message' => 'Foto profil berhasil dihapus.',
        ], 200);
    }
}

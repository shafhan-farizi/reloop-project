<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function __construct(
        protected FileUploadService $uploadService
    ) {}

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

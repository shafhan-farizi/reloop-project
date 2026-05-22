<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => [
                'required',
                'string',
                'max:50',
                'unique:users,username',
                'regex:/^[a-z0-9_]+$/'
            ],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
            'bio' => ['nullable', 'string'],
        ], [
            'username.unique' => 'Username sudah digunakan.',
            'username.regex' => 'Username hanya boleh huruf kecil, angka, dan underscore.',
            'email.unique' => 'Email sudah terdaftar.',
        ]);

        // hash password
        $validated['password'] = Hash::make($validated['password']);

        $validated['role'] = 'user';
        $validated['is_active'] = true;

        $user = User::create($validated);

        return response()->json([
            'code' => 201,
            'status' => 'success',
            'message' => 'Register successful',
            'user' => new UserResource($user),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->email)->first();

        // cek email & password
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'code' => 401,
                'status' => 'error',
                'message' => 'Email atau password salah',
            ], 401);
        }

        // cek akun aktif
        if (! $user->is_active) {
            return response()->json([
                'code' => 403,
                'status' => 'error',
                'message' => 'Akun dinonaktifkan',
            ], 403);
        }

        // hapus token lama
        $user->tokens()->delete();

        // generate token baru
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'code' => 200,
            'status' => 'success',
            'message' => 'Login successful',
            'token' => $token,
            'user' => new UserResource($user),
        ], 200);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'code' => 200,
            'status' => 'success',
            'message' => 'Logout successful',
        ], 200);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'code' => 200,
            'status' => 'success',
            'message' => 'User data retrieved successfully',
            'user' => new UserResource($request->user()),
        ], 200);
    }
}

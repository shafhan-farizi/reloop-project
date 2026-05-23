<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsActive
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // belum login
        if (! $user) {

            return response()->json([
                'code' => 401,
                'status' => 'error',
                'message' => 'Unauthenticated. Silakan login terlebih dahulu.',
            ], 401);

        }

        // akun nonaktif
        if (! $user->is_active) {

            // revoke token supaya user otomatis logout
            $user->tokens()->delete();

            return response()->json([
                'code' => 403,
                'status' => 'error',
                'message' => 'Akun kamu dinonaktifkan. Hubungi admin.',
            ], 403);

        }

        return $next($request);
    }
}

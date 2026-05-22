<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsAdmin
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

        // bukan admin
        if ($user->role !== 'admin') {

            return response()->json([
                'code' => 403,
                'status' => 'error',
                'message' => 'Akses ditolak. Hanya admin yang bisa mengakses resource ini.',
            ], 403);

        }

        return $next($request);
    }
}

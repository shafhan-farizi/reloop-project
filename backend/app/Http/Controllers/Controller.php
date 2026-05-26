<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class Controller
{
    /**
     * Format standar error response untuk semua controller.
     */
    protected function errorResponse(string $message, int $code): JsonResponse
    {
        return response()->json([
            'code'    => $code,
            'status'  => 'error',
            'message' => $message,
        ], $code);
    }
}

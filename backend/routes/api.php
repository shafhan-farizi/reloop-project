<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);

    // maksimal 5 percobaan login per menit untuk mencegah brute-force
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
});

// protected routes, harus login dulu
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // 
});

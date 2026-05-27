<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);

    // maksimal 5 percobaan login per menit untuk mencegah brute-force
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
});

// kategori publik — tidak butuh token
Route::get('/categories',      [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

// item
Route::get('/items', [ItemController::class, 'index']);
Route::get('/items/{id}', [ItemController::class, 'show']);

// protected routes, harus login dulu
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // item yang didonasikan user
    Route::get('/user/items', [ItemController::class, 'myItems']);
    // item management
    Route::post('/items', [ItemController::class, 'store']);
    Route::put('/items/{id}', [ItemController::class, 'update']);
    Route::post('/items/{id}/images', [ItemController::class, 'updateImages']);
    Route::delete('/items/{id}', [ItemController::class, 'destroy']);

    // requests
    Route::get('/requests/incoming', [RequestController::class, 'incoming']);
    Route::get('/requests', [RequestController::class, 'index']);
    Route::post('/requests', [RequestController::class, 'store']);
    Route::get('/requests/{id}', [RequestController::class, 'show']);
    Route::put('/requests/{id}/approve', [RequestController::class, 'approve']);
    Route::put('/requests/{id}/reject', [RequestController::class, 'reject']);
    Route::put('/requests/{id}/cancel', [RequestController::class, 'cancel']);

    // shipments
    Route::get('/shipments', [ShipmentController::class, 'index']);
    Route::get('/shipments/{id}', [ShipmentController::class, 'show']);
    Route::post('/shipments', [ShipmentController::class, 'store']);
    Route::put('/shipments/{id}/status', [ShipmentController::class, 'updateStatus']);

    // tracking
    Route::get('/shipments/{receipt}/track', [ShipmentController::class, 'trackByReceipt']);

    // feedback
    Route::post('/shipments/{id}/feedback', [ShipmentController::class, 'submitFeedback']);
    Route::put('/shipments/{id}/feedback', [ShipmentController::class, 'updateFeedback']);

    // user profile
    Route::prefix('user')->group(function () {
        Route::get('/profile', [UserController::class, 'show']);
        Route::put('/profile', [UserController::class, 'update']);
        Route::put('/password', [UserController::class, 'changePassword']);
        Route::post('/photo', [UserController::class, 'uploadPhoto']);
        Route::delete('/photo', [UserController::class, 'deletePhoto']);
    });

    // admin — hanya bisa diakses oleh user dengan role admin
    Route::middleware([
        'auth:sanctum',
        'active',
        'admin'
    ])->prefix('admin')->group(function () {

        // user management
        Route::get('/users', [UserController::class, 'index']);
        Route::put(
            '/users/{user}/toggle-active',
            [UserController::class, 'toggleActive']
        );

        // category management
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    });
});

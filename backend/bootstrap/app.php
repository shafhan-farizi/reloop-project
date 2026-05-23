<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

         $middleware->alias([
            'active' => \App\Http\Middleware\EnsureIsActive::class,
            'admin'  => \App\Http\Middleware\EnsureIsAdmin::class,
        ]);

        // paksa API auth gagal return JSON
        $middleware->redirectGuestsTo(function (Request $request) {

            if ($request->is('api/*')) {
                throw new AuthenticationException(
                    'Unauthenticated.'
                );
            }

            return route('login');
        });
    })

    ->withExceptions(function (Exceptions $exceptions): void {

        // semua route api return json
        $exceptions->shouldRenderJsonWhen(function (Request $request) {
            return $request->is('api/*');
        });

        // custom response unauthenticated
        $exceptions->render(function (
            AuthenticationException $e,
            Request $request
        ) {

            if ($request->is('api/*')) {

                return response()->json([
                    'code' => 401,
                    'status' => 'error',
                    'message' => 'Unauthenticated. Silakan login terlebih dahulu.',
                ], 401);
            }
        });
    })->create();

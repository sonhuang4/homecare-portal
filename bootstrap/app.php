<?php

use App\Http\Middleware\SetLanguage;
use App\Providers\LanguageServiceProvider;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withProviders([
        // ADD THIS LINE - Register Language Service Provider
        LanguageServiceProvider::class,
    ])
    ->withMiddleware(function (Middleware $middleware) {
        // YOUR EXISTING MIDDLEWARE
        $middleware->web(append: [
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        // UPDATED - Register both language and admin middleware aliases
        $middleware->alias([
            'set.language' => SetLanguage::class,
            'admin' => \App\Http\Middleware\AdminMiddleware::class,  // ADD THIS LINE
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
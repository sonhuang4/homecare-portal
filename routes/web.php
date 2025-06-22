<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Client\DashboardController;
use App\Http\Controllers\Client\RequestController;
use Inertia\Inertia;

Route::get('/', function () {
    return inertia('Welcome');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('client.dashboard');
});


// Client Request Routes
Route::middleware(['auth'])->prefix('requests')->name('requests.')->group(function () {
    Route::get('/', [RequestController::class, 'index'])->name('index');           // GET /requests
    Route::get('/create', [RequestController::class, 'create'])->name('create');   // GET /requests/create  
    Route::post('/', [RequestController::class, 'store'])->name('store');          // POST /requests
    Route::get('/{id}', [RequestController::class, 'show'])->name('show');         // GET /requests/1
});

// Auth routes (login, logout, register processing)
require __DIR__.'/auth.php';
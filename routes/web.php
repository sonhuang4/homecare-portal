<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WhatsAppController;
use App\Http\Controllers\AdminDashboardController; // ADD THIS IMPORT
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Client\DashboardController;
use App\Http\Controllers\Client\RequestController;
use App\Http\Controllers\Client\AppointmentController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RequestController as AdminRequestController;
use App\Http\Controllers\Admin\DocumentController;
use App\Http\Controllers\Client\BillingController;
use Inertia\Inertia;

Route::get('/', function () {
    return inertia('Welcome');
});

Route::get('/language/{language}', [LanguageController::class, 'switch'])->name('language.switch');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('client.dashboard');
    
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
// Payment and Billing Routes
Route::middleware(['auth'])->prefix('billing')->group(function () {
    Route::post('/subscribe', [BillingController::class, 'subscribe'])->name('billing.subscribe');
});

// Client Request Routes
Route::middleware(['auth'])->prefix('requests')->name('requests.')->group(function () {
    Route::get('/', [RequestController::class, 'index'])->name('index');           
    Route::get('/create', [RequestController::class, 'create'])->name('create');   
    Route::post('/', [RequestController::class, 'store'])->name('store');          
    Route::get('/{id}', [RequestController::class, 'show'])->name('show');         
});

// Client Appointment Routes
Route::middleware(['auth'])->prefix('appointments')->name('appointments.')->group(function () {
    Route::get('/', [AppointmentController::class, 'index'])->name('index');                    
    Route::get('/create', [AppointmentController::class, 'create'])->name('create');            
    Route::post('/', [AppointmentController::class, 'store'])->name('store');                   
    Route::get('/{id}', [AppointmentController::class, 'show'])->name('show');                  
    Route::get('/{id}/edit', [AppointmentController::class, 'edit'])->name('edit');             
    Route::patch('/{id}', [AppointmentController::class, 'update'])->name('update');            
    Route::get('/{id}/reschedule', [AppointmentController::class, 'reschedule'])->name('reschedule'); 
    Route::patch('/{id}/reschedule', [AppointmentController::class, 'processReschedule'])->name('process_reschedule'); 
    Route::patch('/{id}/cancel', [AppointmentController::class, 'cancel'])->name('cancel');     
    
    // API route for getting available slots
    Route::get('/api/available-slots', [AppointmentController::class, 'getAvailableSlots'])->name('available_slots');
});

// WhatsApp Support Routes
Route::middleware(['auth'])->prefix('whatsapp')->name('whatsapp.')->group(function () {
    Route::get('/', [WhatsAppController::class, 'index'])->name('index');                       
    Route::post('/start-chat', [WhatsAppController::class, 'startChat'])->name('start_chat');   
    Route::get('/stats', [WhatsAppController::class, 'getStats'])->name('stats');               
    
    // WhatsApp Notification Routes (for internal use - authenticated)
    Route::post('/notify/appointment/{id}', [WhatsAppController::class, 'sendAppointmentNotification'])->name('notify.appointment');
    Route::post('/notify/request/{id}', [WhatsAppController::class, 'sendRequestNotification'])->name('notify.request');
});

// Admin Routes - Add after your existing routes
Route::middleware(['auth'])->group(function () {
    // Check if user is admin and redirect accordingly
    Route::get('/admin', function () {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Access denied. Admin privileges required.');
        }
        return redirect('/admin/dashboard');
    });
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Admin Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/create', [UserController::class, 'create'])->name('create');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/{id}', [UserController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [UserController::class, 'edit'])->name('edit');
        Route::patch('/{id}', [UserController::class, 'update'])->name('update');
        Route::patch('/{id}/toggle-status', [UserController::class, 'toggleStatus'])->name('toggle-status');
        Route::delete('/{id}', [UserController::class, 'destroy'])->name('destroy');
        Route::get('/export', [UserController::class, 'export'])->name('export');
    });

    Route::prefix('requests')->name('requests.')->group(function () {
        Route::get('/', [AdminRequestController::class, 'index'])->name('index');
        Route::get('/{id}', [AdminRequestController::class, 'show'])->name('show');
        Route::patch('/{id}', [AdminRequestController::class, 'update'])->name('update');
    });

    Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::delete('/documents/{id}/delete', [DocumentController::class, 'destroy'])->name('documents.destroy');
});

// Auth routes (login, logout, register processing)
require __DIR__.'/auth.php';
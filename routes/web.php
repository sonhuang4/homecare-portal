<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WhatsAppController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Client\DashboardController;
use App\Http\Controllers\Client\RequestController;
use App\Http\Controllers\Client\AppointmentController;
use App\Http\Controllers\LanguageController;
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

// Client Request Routes
Route::middleware(['auth'])->prefix('requests')->name('requests.')->group(function () {
    Route::get('/', [RequestController::class, 'index'])->name('index');           // GET /requests
    Route::get('/create', [RequestController::class, 'create'])->name('create');   // GET /requests/create  
    Route::post('/', [RequestController::class, 'store'])->name('store');          // POST /requests
    Route::get('/{id}', [RequestController::class, 'show'])->name('show');         // GET /requests/1
});

// Client Appointment Routes
Route::middleware(['auth'])->prefix('appointments')->name('appointments.')->group(function () {
    Route::get('/', [AppointmentController::class, 'index'])->name('index');                    // GET /appointments
    Route::get('/create', [AppointmentController::class, 'create'])->name('create');            // GET /appointments/create
    Route::post('/', [AppointmentController::class, 'store'])->name('store');                   // POST /appointments
    Route::get('/{id}', [AppointmentController::class, 'show'])->name('show');                  // GET /appointments/1
    Route::get('/{id}/edit', [AppointmentController::class, 'edit'])->name('edit');             // GET /appointments/1/edit
    Route::patch('/{id}', [AppointmentController::class, 'update'])->name('update');            // PATCH /appointments/1
    Route::get('/{id}/reschedule', [AppointmentController::class, 'reschedule'])->name('reschedule'); // GET /appointments/1/reschedule
    Route::patch('/{id}/reschedule', [AppointmentController::class, 'processReschedule'])->name('process_reschedule'); // PATCH /appointments/1/reschedule
    Route::patch('/{id}/cancel', [AppointmentController::class, 'cancel'])->name('cancel');     // PATCH /appointments/1/cancel
    
    // API route for getting available slots
    Route::get('/api/available-slots', [AppointmentController::class, 'getAvailableSlots'])->name('available_slots');
});

// WhatsApp Support Routes
Route::middleware(['auth'])->prefix('whatsapp')->name('whatsapp.')->group(function () {
    Route::get('/', [WhatsAppController::class, 'index'])->name('index');                       // GET /whatsapp
    Route::post('/start-chat', [WhatsAppController::class, 'startChat'])->name('start_chat');   // POST /whatsapp/start-chat
    Route::get('/stats', [WhatsAppController::class, 'getStats'])->name('stats');               // GET /whatsapp/stats
    
    // WhatsApp Notification Routes (for internal use - authenticated)
    Route::post('/notify/appointment/{id}', [WhatsAppController::class, 'sendAppointmentNotification'])->name('notify.appointment');
    Route::post('/notify/request/{id}', [WhatsAppController::class, 'sendRequestNotification'])->name('notify.request');
});

// WhatsApp Webhook Routes (no auth required - must be accessible by Facebook)
Route::prefix('whatsapp/webhook')->group(function () {
    Route::get('/', [WhatsAppController::class, 'webhook'])->name('whatsapp.webhook.verify');   // GET for webhook verification
    Route::post('/', [WhatsAppController::class, 'webhook'])->name('whatsapp.webhook');         // POST for receiving messages
});

// Auth routes (login, logout, register processing)
require __DIR__.'/auth.php';
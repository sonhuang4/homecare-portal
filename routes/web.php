<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

// Test route
Route::get('/test', function () {
    return Inertia::render('Test');
});

// Redirect root to login or dashboard
Route::get('/', function () {
    return Auth::check() ? redirect('/dashboard') : redirect('/login');
});

// Login routes
Route::get('/login', function () {
    return view('simple-login');
})->middleware('guest')->name('login');

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::attempt($credentials, $request->boolean('remember'))) {
        $request->session()->regenerate();
        return redirect()->intended('/dashboard');
    }

    return back()->withErrors([
        'email' => 'The provided credentials do not match our records.',
    ]);
});

// Dashboard route
Route::get('/dashboard', function () {
    return view('simple-dashboard');
})->middleware('auth')->name('dashboard');

// Logout route
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/login');
})->middleware('auth');

// Service Request routes
Route::get('/service-request', function () {
    return Inertia::render('ServiceRequest');
})->middleware('auth');

Route::post('/service-request', function (Request $request) {
    $validated = $request->validate([
        'service_type' => 'required|string',
        'priority' => 'required|in:standard,urgent,emergency',
        'description' => 'required|string|min:10',
        'preferred_date' => 'nullable|date|after_or_equal:today',
    ]);

    \App\Models\ServiceRequest::create([
        'user_id' => Auth::id(),
        'service_type' => $validated['service_type'],
        'priority' => $validated['priority'],
        'description' => $validated['description'],
        'preferred_date' => $validated['preferred_date'],
        'status' => 'pending',
    ]);

    return redirect('/dashboard')->with('success', 'Service request submitted successfully!');
})->middleware('auth');
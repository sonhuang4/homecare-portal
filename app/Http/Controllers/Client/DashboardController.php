<?php
// app/Http/Controllers/Client/DashboardController.php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Get real data from database
        $membership = [
            'type' => $user->membership_type ?? 'Basic',
            'status' => $user->membership_status ?? 'Active',
            'startDate' => $user->membership_start ?? now()->subMonths(6)->format('Y-m-d'),
            'expiryDate' => $user->membership_expiry ?? now()->addMonths(6)->format('Y-m-d'),
            'autoRenew' => $user->auto_renew ?? true
        ];

        $visits = [
            'total' => $user->total_visits ?? 24,
            'remaining' => $user->remaining_visits ?? 8,
            'used' => $user->used_visits ?? 16,
            'nextAppointment' => $user->next_appointment ?? '2024-06-25 10:00 AM'
        ];

        $notifications = [
            ['id' => 1, 'message' => 'Your appointment is confirmed', 'type' => 'success', 'time' => '2 hours ago'],
            ['id' => 2, 'message' => 'Document uploaded successfully', 'type' => 'info', 'time' => '1 day ago'],
        ];

        return Inertia::render('Client/Dashboard', [
            'membership' => $membership,
            'visits' => $visits,
            'notifications' => $notifications
        ]);
    }
}
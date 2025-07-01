<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Request as ServiceRequest;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
            'total_requests' => ServiceRequest::count(),
            'pending_requests' => ServiceRequest::whereIn('status', ['submitted', 'in_progress'])->count(),
            'total_appointments' => Appointment::count(),
            'upcoming_appointments' => Appointment::upcoming()->count(),
            'revenue_this_month' => 0, // Will implement with billing
            'new_users_this_month' => User::whereMonth('created_at', now()->month)->count(),
        ];

        $recentUsers = User::latest()->limit(5)->get();
        $recentRequests = ServiceRequest::with('user')->latest()->limit(5)->get();
        $recentAppointments = Appointment::with('user')->latest()->limit(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentRequests' => $recentRequests,
            'recentAppointments' => $recentAppointments
        ]);
    }
}
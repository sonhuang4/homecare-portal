<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Request as ServiceRequest;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display admin user management
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->has('role') && $request->role && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        // Filter by status
        if ($request->has('status') && $request->status && $request->status !== 'all') {
            if ($request->status === 'active') {
                $query->whereNull('email_verified_at')->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            } elseif ($request->status === 'unverified') {
                $query->whereNull('email_verified_at');
            }
        }

        $users = $query->withCount(['requests', 'appointments'])
                      ->orderBy($request->sort ?? 'created_at', $request->direction ?? 'desc')
                      ->paginate(20);

        // Stats for dashboard
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
            'new_this_month' => User::whereMonth('created_at', now()->month)->count(),
            'subscribers' => User::whereNotNull('subscription_plan')->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search ?? '',
                'role' => $request->role ?? 'all',
                'status' => $request->status ?? 'all',
                'sort' => $request->sort ?? 'created_at',
                'direction' => $request->direction ?? 'desc',
            ]
        ]);
    }

    /**
     * Show user details
     */
    public function show($id)
    {
        $user = User::with(['requests', 'appointments'])
                   ->withCount(['requests', 'appointments'])
                   ->findOrFail($id);

        // Recent activity
        $recentRequests = $user->requests()
                              ->latest()
                              ->limit(5)
                              ->get();

        $recentAppointments = $user->appointments()
                                  ->latest()
                                  ->limit(5)
                                  ->get();

        return Inertia::render('Admin/Users/Index', [
            'user' => $user,
            'recentRequests' => $recentRequests,
            'recentAppointments' => $recentAppointments
        ]);
    }

    /**
     * Update user
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'subscription_plan' => 'nullable|in:standard,premium,deluxe',
            'is_active' => 'boolean',
            'role' => 'required|in:client,admin',
            'notes' => 'nullable|string|max:1000'
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'User updated successfully');
    }

    /**
     * Toggle user active status
     */
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => !$user->is_active]);

        $status = $user->is_active ? 'activated' : 'deactivated';
        return redirect()->back()->with('success', "User {$status} successfully");
    }

    /**
     * Delete user
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Check if user has active requests or appointments
        if ($user->requests()->whereIn('status', ['submitted', 'in_progress'])->exists() ||
            $user->appointments()->whereIn('status', ['scheduled', 'confirmed'])->exists()) {
            return redirect()->back()->with('error', 'Cannot delete user with active requests or appointments');
        }

        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully');
    }
}
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        // Better approach: Get subscriptions through User model
        $subscriptions = User::whereHas('subscriptions')
            ->with(['subscriptions' => function($query) {
                $query->latest();
            }])
            ->get()
            ->flatMap(function($user) {
                return $user->subscriptions->map(function($subscription) use ($user) {
                    return [
                        'id' => $subscription->id,
                        'user' => [
                            'name' => $user->name,
                            'email' => $user->email
                        ],
                        'price_id' => $subscription->stripe_price,
                        'stripe_status' => $subscription->stripe_status,
                        'created_at' => $subscription->created_at->format('Y-m-d'),
                    ];
                });
            });

        return Inertia::render('Admin/Users/Subscriptions', [
            'subscriptions' => $subscriptions
        ]);
    }
}
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index()
    {
        $subscriptions = \Laravel\Cashier\Subscription::with('user')
            ->latest()
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'user' => [
                    'name' => $s->user->name,
                    'email' => $s->user->email
                ],
                'price_id' => $s->stripe_price,
                'stripe_status' => $s->stripe_status,
                'created_at' => $s->created_at->format('Y-m-d'),
            ]);

        return Inertia::render('Admin/Users/Subscriptions', [
            'subscriptions' => $subscriptions
        ]);
    }
}

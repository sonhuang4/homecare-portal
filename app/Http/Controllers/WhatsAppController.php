<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class WhatsAppController extends Controller
{
    /**
     * Display WhatsApp chat interface
     */
    public function index()
    {
        // NWB Homecare support teams
        $supportTeams = [
            'general' => [
                'name' => 'General Support',
                'phone' => '+13235554663',
                'hours' => '8:00 AM - 6:00 PM PST'
            ],
            'emergency' => [
                'name' => 'Emergency Dispatch',
                'phone' => '+13235554663',
                'hours' => '24/7 Available'
            ],
            'technical' => [
                'name' => 'Technical Support',
                'phone' => '+13235554664',
                'hours' => '7:00 AM - 8:00 PM PST'
            ],
            'billing' => [
                'name' => 'Billing Support',
                'phone' => '+13235554665',
                'hours' => '9:00 AM - 5:00 PM PST'
            ],
            'sales' => [
                'name' => 'Sales & Estimates',
                'phone' => '+13235554666',
                'hours' => '8:00 AM - 6:00 PM PST'
            ]
        ];
        
        return Inertia::render('Client/WhatsApp/Chat', [
            'supportTeams' => $supportTeams,
            'businessPhone' => '+13235554663'
        ]);
    }

    /**
     * Initiate chat with specific support team
     */
    public function startChat(Request $request)
    {
        $request->validate([
            'team' => 'required|in:general,emergency,technical,billing,sales',
            'message' => 'required|string|max:500'
        ]);

        $user = Auth::user();
        $team = $request->input('team');
        $message = $request->input('message');
        
        // NWB Homecare support team phone numbers
        $supportTeams = [
            'general' => '+13235554663',
            'emergency' => '+13235554663',
            'technical' => '+13235554664',
            'billing' => '+13235554665',
            'sales' => '+13235554666'
        ];
        
        $supportPhone = $supportTeams[$team] ?? '+13235554663';

        // Create pre-filled message for NWB
        $prefilledMessage = "Hi, I'm {$user->name} (NWB Client ID: {$user->id}). {$message}";
        
        // Generate WhatsApp URL
        $chatUrl = $this->generateChatUrl($supportPhone, $prefilledMessage);

        // Log the chat initiation
        Log::info('NWB WhatsApp chat initiated', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'team' => $team,
            'support_phone' => $supportPhone,
            'message_preview' => substr($message, 0, 50) . '...'
        ]);

        // Always return JSON for AJAX requests
        return response()->json([
            'success' => true,
            'chat_url' => $chatUrl,
            'team' => [
                'name' => ucfirst($team) . ' Support',
                'phone' => $supportPhone
            ],
            'message' => 'WhatsApp chat initiated successfully'
        ]);
    }

    /**
     * Generate WhatsApp chat URL
     */
    protected function generateChatUrl($phone, $message = null)
    {
        // Remove all non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        // Add country code if not present (assuming US)
        if (strlen($phone) === 10) {
            $phone = '1' . $phone;
        }
        
        $url = "https://wa.me/{$phone}";
        
        if ($message) {
            $url .= '?text=' . urlencode($message);
        }
        
        return $url;
    }

    // ... rest of your methods remain the same
}
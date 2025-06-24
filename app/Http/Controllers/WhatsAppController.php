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
        // Mock support teams data
        $supportTeams = [
            'general' => [
                'name' => 'General Support',
                'phone' => config('whatsapp.support_teams.general.phone', '+1234567890'),
                'hours' => '8:00 AM - 6:00 PM EST'
            ],
            'medical' => [
                'name' => 'Medical Support',
                'phone' => config('whatsapp.support_teams.medical.phone', '+1234567891'),
                'hours' => '24/7'
            ],
            'billing' => [
                'name' => 'Billing Support',
                'phone' => config('whatsapp.support_teams.billing.phone', '+1234567892'),
                'hours' => '9:00 AM - 5:00 PM EST'
            ],
            'emergency' => [
                'name' => 'Emergency Support',
                'phone' => config('whatsapp.support_teams.emergency.phone', '+1234567893'),
                'hours' => '24/7'
            ]
        ];
        
        return Inertia::render('Client/WhatsApp/Chat', [
            'supportTeams' => $supportTeams,
            'businessPhone' => config('whatsapp.business_phone', '+1234567890')
        ]);
    }

    /**
     * Initiate chat with specific support team
     */
    public function startChat(Request $request)
    {
        $request->validate([
            'team' => 'required|in:general,medical,billing,emergency',
            'message' => 'required|string|max:500'
        ]);

        $user = Auth::user();
        $team = $request->input('team');
        $message = $request->input('message');
        
        // Get support team phone number
        $supportTeams = [
            'general' => '+1234567890',
            'medical' => '+1234567891',
            'billing' => '+1234567892',
            'emergency' => '+1234567893'
        ];
        
        $supportPhone = $supportTeams[$team] ?? '+1234567890';

        // Create pre-filled message
        $prefilledMessage = "Hi, I'm {$user->name} (Client ID: {$user->id}). {$message}";
        
        // Generate WhatsApp URL
        $chatUrl = $this->generateChatUrl($supportPhone, $prefilledMessage);

        // Log the chat initiation
        Log::info('WhatsApp chat initiated', [
            'user_id' => $user->id,
            'team' => $team,
            'support_phone' => $supportPhone
        ]);

        return response()->json([
            'success' => true,
            'chat_url' => $chatUrl,
            'team' => [
                'name' => ucfirst($team) . ' Support',
                'phone' => $supportPhone
            ]
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

    /**
     * Handle WhatsApp webhook (for receiving messages)
     */
    public function webhook(Request $request)
    {
        // Verify webhook (required by WhatsApp)
        if ($request->has('hub_mode') && $request->has('hub_verify_token')) {
            return $this->verifyWebhook($request);
        }

        // Process incoming message
        $this->processIncomingMessage($request);

        return response('OK', 200);
    }

    /**
     * Verify WhatsApp webhook
     */
    protected function verifyWebhook(Request $request)
    {
        $mode = $request->input('hub_mode');
        $token = $request->input('hub_verify_token');
        $challenge = $request->input('hub_challenge');

        if ($mode === 'subscribe' && $token === config('whatsapp.api.webhook_verify_token')) {
            Log::info('WhatsApp webhook verified successfully');
            return response($challenge, 200);
        }

        Log::error('WhatsApp webhook verification failed', [
            'mode' => $mode,
            'token' => $token
        ]);
        
        return response('Forbidden', 403);
    }

    /**
     * Process incoming WhatsApp message
     */
    protected function processIncomingMessage(Request $request)
    {
        $data = $request->all();
        
        if (!isset($data['entry'][0]['changes'][0]['value']['messages'])) {
            return;
        }

        $messages = $data['entry'][0]['changes'][0]['value']['messages'];
        
        foreach ($messages as $message) {
            $from = $message['from'];
            $messageBody = $message['text']['body'] ?? '';
            $messageId = $message['id'];

            Log::info('WhatsApp message received', [
                'from' => $from,
                'message_id' => $messageId,
                'body' => $messageBody
            ]);

            // Find user by phone number
            $user = \App\Models\User::where('phone', 'LIKE', '%' . substr($from, -10))->first();

            // Store message in database (optional)
            $this->storeMessage($from, $messageBody, $user);
        }
    }

    /**
     * Store message for record keeping
     */
    protected function storeMessage($from, $message, $user = null)
    {
        // Log the message for now
        Log::info('Storing WhatsApp message', [
            'from' => $from,
            'user_id' => $user?->id,
            'message' => $message,
            'timestamp' => now()
        ]);
    }

    /**
     * Get chat statistics (for admin)
     */
    public function getStats()
    {
        return response()->json([
            'total_chats' => 150,
            'active_chats' => 12,
            'response_time' => '2.5 minutes',
            'satisfaction_rate' => '94%',
            'team_distribution' => [
                'general' => 45,
                'medical' => 35,
                'billing' => 15,
                'emergency' => 5
            ]
        ]);
    }

    /**
     * Send appointment notifications via WhatsApp (placeholder)
     */
    public function sendAppointmentNotification($appointmentId, $type = 'confirmation')
    {
        Log::info('WhatsApp appointment notification requested', [
            'appointment_id' => $appointmentId,
            'type' => $type
        ]);

        return ['success' => true, 'message' => 'Notification sent (mock)'];
    }

    /**
     * Send request update notifications (placeholder)
     */
    public function sendRequestNotification($requestId, $status, $message = '')
    {
        Log::info('WhatsApp request notification requested', [
            'request_id' => $requestId,
            'status' => $status,
            'message' => $message
        ]);

        return ['success' => true, 'message' => 'Notification sent (mock)'];
    }
}
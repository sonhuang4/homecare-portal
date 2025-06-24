<?php

return [
    /*
    |--------------------------------------------------------------------------
    | WhatsApp Business API Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for WhatsApp Business API integration
    |
    */

    'enabled' => env('WHATSAPP_ENABLED', true),

    // WhatsApp Business API settings
    'api' => [
        'base_url' => env('WHATSAPP_API_URL', 'https://graph.facebook.com/v18.0'),
        'phone_number_id' => env('WHATSAPP_PHONE_NUMBER_ID'),
        'access_token' => env('WHATSAPP_ACCESS_TOKEN'),
        'webhook_verify_token' => env('WHATSAPP_WEBHOOK_VERIFY_TOKEN'),
    ],

    // Default business phone number
    'business_phone' => env('WHATSAPP_BUSINESS_PHONE', '+1234567890'),

    // Support team assignments
    'support_teams' => [
        'general' => [
            'name' => 'General Support',
            'phone' => env('WHATSAPP_GENERAL_SUPPORT', '+1234567890'),
            'hours' => '8:00 AM - 6:00 PM EST',
        ],
        'medical' => [
            'name' => 'Medical Support',
            'phone' => env('WHATSAPP_MEDICAL_SUPPORT', '+1234567891'),
            'hours' => '24/7',
        ],
        'billing' => [
            'name' => 'Billing Support',
            'phone' => env('WHATSAPP_BILLING_SUPPORT', '+1234567892'),
            'hours' => '9:00 AM - 5:00 PM EST',
        ],
        'emergency' => [
            'name' => 'Emergency Support',
            'phone' => env('WHATSAPP_EMERGENCY_SUPPORT', '+1234567893'),
            'hours' => '24/7',
        ],
    ],

    // Message templates
    'templates' => [
        'welcome' => 'Hello {{name}}! Welcome to Homecare by NWB WhatsApp support. How can we help you today?',
        'appointment_confirmation' => 'Your appointment has been confirmed for {{date}} at {{time}}. Location: {{address}}',
        'appointment_reminder' => 'Reminder: You have an appointment tomorrow at {{time}}. Please reply CONFIRM to acknowledge.',
        'request_update' => 'Update on your request #{{request_id}}: {{status}}. {{message}}',
        'support_transfer' => 'Transferring you to {{team_name}}. They will assist you shortly.',
    ],

    // Webhook settings
    'webhook' => [
        'url' => env('WHATSAPP_WEBHOOK_URL', env('APP_URL') . '/whatsapp/webhook'),
        'verify_token' => env('WHATSAPP_WEBHOOK_VERIFY_TOKEN'),
    ],

    // Chat routing rules
    'routing' => [
        'keywords' => [
            'appointment' => ['appointment', 'booking', 'schedule', 'reschedule', 'cancel'],
            'medical' => ['medical', 'doctor', 'nurse', 'medication', 'health', 'emergency'],
            'billing' => ['billing', 'payment', 'invoice', 'cost', 'insurance'],
            'general' => ['help', 'support', 'question', 'info'],
        ],
        'business_hours' => [
            'start' => '08:00',
            'end' => '18:00',
            'timezone' => 'America/New_York',
        ],
    ],
];
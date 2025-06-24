<?php

return [
    'default' => env('DEFAULT_LANGUAGE', 'en'),
    
    'supported_languages' => [
        'en' => [
            'name' => 'English',
            'native_name' => 'English',
            'flag' => '🇺🇸',
            'rtl' => false,
        ],
        'es' => [
            'name' => 'Spanish',
            'native_name' => 'Español',
            'flag' => '🇪🇸',
            'rtl' => false,
        ],
    ],

    'fallback_language' => 'en',
    'auto_detect' => true,
    'session_key' => 'app_language',
    'cookie_key' => 'app_language',
    'cookie_duration' => 60 * 24 * 365,
];
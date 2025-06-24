<?php

namespace App\Http\Controllers;

use App\Services\LanguageService;
use Illuminate\Http\Request;

class LanguageController extends Controller
{
    public function switch(Request $request, $language)
    {
        if (!LanguageService::isSupported($language)) {
            return back()->with('error', 'Language not supported');
        }

        LanguageService::setLanguage($language);

        return back()->with('success', __('messages.language_changed'));
    }

    public function current()
    {
        $currentLang = LanguageService::getCurrentLanguage();
        $supportedLanguages = LanguageService::getSupportedLanguages();

        return response()->json([
            'current' => $currentLang,
            'current_data' => $supportedLanguages[$currentLang],
            'supported' => $supportedLanguages,
            'direction' => LanguageService::getDirection(),
        ]);
    }
}
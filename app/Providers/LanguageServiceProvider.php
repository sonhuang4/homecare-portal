<?php

namespace App\Providers;

use App\Services\LanguageService;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\App;
use Inertia\Inertia;

class LanguageServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Inertia::share([
            'currentLanguage' => function () {
                return LanguageService::getCurrentLanguage();
            },
            'supportedLanguages' => function () {
                return LanguageService::getSupportedLanguages();
            },
            'translations' => function () {
                $locale = App::getLocale();
                $translations = [];
                $translationPath = lang_path($locale);
                
                if (is_dir($translationPath)) {
                    $files = glob($translationPath . '/*.php');
                    
                    foreach ($files as $file) {
                        $key = basename($file, '.php');
                        $translations[$key] = require $file;
                    }
                }
                
                return $translations;
            },
            'direction' => function () {
                return LanguageService::getDirection();
            }
        ]);
    }
}
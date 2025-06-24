<?php

namespace App\Services;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cookie;

class LanguageService
{
    public static function getSupportedLanguages()
    {
        return config('language.supported_languages');
    }

    public static function getCurrentLanguage()
    {
        return Session::get(config('language.session_key'), config('language.default'));
    }

    public static function setLanguage($language)
    {
        if (!self::isSupported($language)) {
            $language = config('language.default');
        }

        Session::put(config('language.session_key'), $language);
        App::setLocale($language);
        
        Cookie::queue(
            config('language.cookie_key'), 
            $language, 
            config('language.cookie_duration')
        );

        return $language;
    }

    public static function isSupported($language)
    {
        return array_key_exists($language, config('language.supported_languages'));
    }

    public static function detectBrowserLanguage($request)
    {
        $acceptLanguage = $request->header('Accept-Language', '');
        $languages = explode(',', $acceptLanguage);
        
        foreach ($languages as $lang) {
            $lang = trim(explode(';', $lang)[0]);
            $lang = substr($lang, 0, 2);
            
            if (self::isSupported($lang)) {
                return $lang;
            }
        }

        return config('language.default');
    }

    public static function initializeLanguage($request)
    {
        $language = null;

        if (Session::has(config('language.session_key'))) {
            $language = Session::get(config('language.session_key'));
        }
        elseif ($request->hasCookie(config('language.cookie_key'))) {
            $language = $request->cookie(config('language.cookie_key'));
        }
        elseif (config('language.auto_detect')) {
            $language = self::detectBrowserLanguage($request);
        }
        else {
            $language = config('language.default');
        }

        return self::setLanguage($language);
    }

    public static function getDirection($language = null)
    {
        $language = $language ?: self::getCurrentLanguage();
        $languages = config('language.supported_languages');
        
        return $languages[$language]['rtl'] ?? false ? 'rtl' : 'ltr';
    }

    public static function getFlag($language = null)
    {
        $language = $language ?: self::getCurrentLanguage();
        $languages = config('language.supported_languages');
        
        return $languages[$language]['flag'] ?? '🌐';
    }
}
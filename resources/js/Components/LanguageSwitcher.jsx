import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import useTranslations from '../Hooks/useTranslations';

export default function LanguageSwitcher({ className = '' }) {
    const { currentLanguage, getSupportedLanguages, switchLanguage } = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    
    const languages = getSupportedLanguages();
    const currentLang = languages.find(lang => lang.code === currentLanguage);

    const handleLanguageChange = (languageCode) => {
        setIsOpen(false);
        switchLanguage(languageCode);
    };

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 border border-white/20"
            >
                <span className="text-lg">{currentLang?.flag || '🌐'}</span>
                <span className="text-sm font-medium hidden sm:block">
                    {currentLang?.native_name || 'Language'}
                </span>
                <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)}
                    ></div>
                    
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 shadow-lg z-20">
                        <div className="py-2">
                            {languages.map((language) => (
                                <Link
                                    key={language.code}
                                    href={`/language/${language.code}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleLanguageChange(language.code);
                                    }}
                                    className={`flex items-center space-x-3 px-4 py-2 text-sm hover:bg-white/10 transition-all duration-200 ${
                                        currentLanguage === language.code 
                                            ? 'bg-white/10 text-white font-medium' 
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    <span className="text-lg">{language.flag}</span>
                                    <div className="flex-1">
                                        <div className="font-medium">{language.native_name}</div>
                                        <div className="text-xs opacity-75">{language.name}</div>
                                    </div>
                                    {currentLanguage === language.code && (
                                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
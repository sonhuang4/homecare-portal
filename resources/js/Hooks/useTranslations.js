import { usePage } from '@inertiajs/react';

export default function useTranslations() {
    const { props } = usePage();
    const translations = props.translations || {};
    const currentLanguage = props.currentLanguage || 'en';
    const supportedLanguages = props.supportedLanguages || {};

    const t = (key, replacements = {}) => {
        const keys = key.split('.');
        let value = translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }

        if (typeof value === 'string') {
            let result = value;
            
            Object.keys(replacements).forEach(placeholder => {
                const regex = new RegExp(`:${placeholder}`, 'g');
                result = result.replace(regex, replacements[placeholder]);
            });
            
            return result;
        }

        return key;
    };

    const getCurrentLanguage = () => {
        return {
            code: currentLanguage,
            ...supportedLanguages[currentLanguage]
        };
    };

    const getSupportedLanguages = () => {
        return Object.keys(supportedLanguages).map(code => ({
            code,
            ...supportedLanguages[code]
        }));
    };

    const switchLanguage = (languageCode) => {
        window.location.href = `/language/${languageCode}`;
    };

    const isRTL = () => {
        return supportedLanguages[currentLanguage]?.rtl || false;
    };

    const getDirection = () => {
        return isRTL() ? 'rtl' : 'ltr';
    };

    return {
        t,
        translate: t,
        currentLanguage,
        getCurrentLanguage,
        getSupportedLanguages,
        switchLanguage,
        isRTL,
        getDirection,
        supportedLanguages
    };
}
import { Translation, SpeakConfig } from '../core/types';

export const translationData: Translation = {
    'en-US': {
        'app': {
            title: 'Qwik Speak',
            subtitle: 'Make your Qwik app speak any language',
            changeLocale: 'Change locale',
            greeting: 'Hi! I am {{name}}',
            description: '<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>',
        },
    },
    'it-IT': {
        'app': {
            title: 'Qwik Speak',
            subtitle: 'Fai parlare alla tua app Qwik qualsiasi lingua',
            changeLocale: 'Cambia località',
            greeting: 'Ciao! Sono {{name}}',
            description: '<em>Libreria di internazionalizzazione (i18n) per tradurre testi, date e numeri nelle app Qwik</em>',
        },
    }
};

export const config: SpeakConfig = {
    languageFormat: 'language-region',
    defaultLocale: { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } },
    supportedLocales: [
        { language: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome', units: { 'length': 'kilometer' } },
        { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } }
    ],
    assets: translationData
};


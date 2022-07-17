import { $ } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';

import { Translation, SpeakConfig, LoadTranslationFn, TranslateFn } from '../core/types';

export const translationData: Translation = {
    "en-US": {
        "app": {
            "title": "Qwik Speak",
            "subtitle": "Make your Qwik app speak any language",
            "changeLocale": "Change locale",
            "greeting": "Hi! I am {{name}}",
            "description": "<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>"
        }
    },
    "it-IT": {
        "app": {
            "title": "Qwik Speak",
            "subtitle": "Fai parlare alla tua app Qwik qualsiasi lingua",
            "changeLocale": "Cambia località",
            "greeting": "Ciao! Sono {{name}}",
            "description": "<em>Libreria di internazionalizzazione (i18n) per tradurre testi, date e numeri nelle app Qwik</em>"
        }
    }
};

export const loadTranslation$: LoadTranslationFn = $(async (language: string, asset: string | Translation) => {
    let url = '';
    // Absolute urls on server
    if (isServer) {
        url = 'http://localhost:3000';
    }
    url += `${asset}-${language}.json`;
    const data = await fetch(url);
    return data.json();
});

export const translateFn: TranslateFn = {
    loadTranslation$: loadTranslation$
};

export const config: SpeakConfig = {
    languageFormat: 'language-region',
    defaultLocale: { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } },
    supportedLocales: [
        { language: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome', units: { 'length': 'kilometer' } },
        { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } }
    ],
    assets: translationData
    /* assets: ['/public/i18n/app'] */
};


import { Locale, SpeakConfig, SpeakState, Translation } from "../library/types";

const translationData: Translation = {
    'en-US': {
        test: 'Test',
        testParams: 'Test {{param}}'
    },
    'it-IT': {
        test: 'Prova'
    }
};

const config: SpeakConfig = {
    languageFormat: 'language-region',
    defaultLocale: { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } },
    supportedLocales: [
        { language: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome', units: { 'length': 'kilometer' } },
        { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } }
    ],
    assets: [
        translationData
    ]
};

const locale: Locale = { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } };

export const ctx: SpeakState = new Proxy({
    locale: locale,
    translation: translationData,
    config: config,
    translateFn: {}
}, {});

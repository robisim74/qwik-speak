import { Translation, TranslationConfig } from '../core/types';

export const translationData: Translation = {
    'en-US': {
        changeLocale: 'Change locale',
        title: 'Qwik Translate',
    },
    'it-IT': {
        changeLocale: 'Cambia località',
        title: 'Qwik Traduci',
    }
};

export const config: TranslationConfig = {
    languageFormat: 'language-region',
    defaultLocale: { language: 'en-US' },
    supportedLocales: [
        { language: 'en-US' },
        { language: 'it-IT' }
    ],
    assets: translationData
};


import { Translation, TranslateConfig } from '../core/types';

export const translationData: Translation = {
    'en-US': {
        changeLocale: 'Change locale',
        title: 'Qwik Translate'
    },
    'it-IT': {
        changeLocale: 'Cambia località',
        title: 'Qwik Traduci'
    }
};

export const config: TranslateConfig = {
    languageFormat: 'language-region',
    defaultLocale: { language: 'en-US' },
    supportedLocales: [
        { language: 'en-US' },
        { language: 'it-IT' }
    ],
    assets: translationData
};


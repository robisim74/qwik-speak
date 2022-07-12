import { $ } from '@builder.io/qwik';
import { LoadTranslationFn, Translation, TranslationConfig } from '../core/types';

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

export const loadTranslation$: LoadTranslationFn = $((language: string) => {
    return translationData[language];
});

export const config: TranslationConfig = {
    languageFormat: 'language-region',
    keySeparator: '.',
    defaultLocale: { language: 'en-US' },
    supportedLocales: [
        { language: 'en-US' },
        { language: 'it-IT' }
    ],
    token: {
        loadTranslation: loadTranslation$
    }
};


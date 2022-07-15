import { Translation, SpeakConfig } from '../core/types';

export const translationData: Translation = {
    'en-US': {
        'app': {
            title: 'Qwik Speak',
            subtitle: 'Make your Qwik app speak any language',
            changeLocale: 'Change locale',
        },
    },
    'it-IT': {
        'app': {
            title: 'Qwik Speak',
            subtitle: 'Fai parlare alla tua app Qwik qualsiasi lingua',
            changeLocale: 'Cambia località',
        },
    }
};

export const config: SpeakConfig = {
    languageFormat: 'language-region',
    defaultLocale: { language: 'en-US' },
    supportedLocales: [
        { language: 'en-US' },
        { language: 'it-IT' }
    ],
    assets: translationData
};


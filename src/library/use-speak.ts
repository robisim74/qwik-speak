import { useStore, useContextProvider, immutable, useMount$, useClientEffect$ } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';

import type { SpeakConfig, TranslateFn, SpeakState } from './types';
import { getUserLanguage$, handleMissingTranslation$, getTranslation$, getLocale$, SpeakContext, setLocale$ } from './constants';
import { loadTranslation, parseLanguage, qDev } from './utils';

export const useSpeak = (config: SpeakConfig, translateFn: TranslateFn = {}): SpeakState => {
    // Assign functions
    translateFn.getTranslation$ = translateFn.getTranslation$ ?? getTranslation$;
    translateFn.getUserLanguage$ = translateFn.getUserLanguage$ ?? getUserLanguage$;
    translateFn.setLocale$ = translateFn.setLocale$ ?? setLocale$;
    translateFn.getLocale$ = translateFn.getLocale$ ?? getLocale$;
    translateFn.handleMissingTranslation$ = translateFn.handleMissingTranslation$ ?? handleMissingTranslation$;

    // Set initial state
    const state = useStore<SpeakState>({
        locale: {},
        translation: {},
        config: config,
        translateFn: translateFn
    }, { recursive: true });
    const { locale, translation } = state;

    useContextProvider(SpeakContext, state);

    // Will block the rendering until callback resolves
    useMount$(async () => {
        // Try to get locale from the storage
        let userLocale = await translateFn.getLocale$?.();

        // Try to get locale by user language
        if (!userLocale) {
            const userLanguage = await translateFn.getUserLanguage$?.();
            userLocale = config.supportedLocales.find(x => parseLanguage(x.language, config.languageFormat) == userLanguage);
        }

        // Use default locale
        if (!userLocale) {
            userLocale = config.defaultLocale;
        }

        // Load translation data
        await loadTranslation(userLocale, state);

        // Set locale
        Object.assign(locale, userLocale);

        // Prevent Qwik from creating subscriptions
        if (isServer) {
            immutable(translation);
            immutable(config);
            immutable(translateFn)
        }

        if (qDev) {
            console.debug('Qwik Speak', '', 'Translation loaded');
        }
    });

    useClientEffect$(async () => {
        // Store the locale
        await translateFn.setLocale$?.(locale);

        if (qDev) {
            console.debug('%cQwik Speak', 'background-color: #0093ee; color: #fff; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;', state);
        }
    });

    return state;
};

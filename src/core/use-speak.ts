import { useStore, useContextProvider, immutable, useMount$ } from '@builder.io/qwik';

import type { SpeakConfig, TranslateFn, SpeakState } from './types';
import { getUserLanguage$, handleMissingTranslation$, loadTranslation$, readLocale$, SpeakContext, writeLocale$ } from './constants';
import { getTranslation } from './utils';

export const useSpeak = (config: SpeakConfig, translateFn: TranslateFn = {}): SpeakState => {
    // Assign functions
    translateFn.loadTranslation$ = translateFn.loadTranslation$ ?? loadTranslation$;
    translateFn.getUserLanguage$ = translateFn.getUserLanguage$ ?? getUserLanguage$;
    translateFn.writeLocale$ = translateFn.writeLocale$ ?? writeLocale$;
    translateFn.readLocale$ = translateFn.readLocale$ ?? readLocale$;
    translateFn.handleMissingTranslation$ = translateFn.handleMissingTranslation$ ?? handleMissingTranslation$;

    // Set initial state
    const speakState = useStore<SpeakState>({
        locale: {},
        translation: {},
        config: config,
        translateFn: translateFn
    }, { recursive: true });
    const { locale, translation } = speakState;

    useContextProvider(SpeakContext, speakState);

    // Will block the rendering of the app until callback resolves
    useMount$(async () => {
        // Try to get locale from the storage
        let userLocale = await translateFn.readLocale$?.();

        // Try to get locale by user language
        if (!userLocale) {
            const userLanguage = await translateFn.getUserLanguage$?.();
            userLocale = config.supportedLocales.find(x => x.language == userLanguage);
        }

        // Use default locale
        if (!userLocale) {
            userLocale = config.defaultLocale;
        }

        // Load translation data
        await getTranslation(userLocale, speakState);

        // Set locale
        Object.assign(locale, userLocale);

        // Prevent Qwik from creating subscriptions
        immutable(translation);
        immutable(config);
        immutable(translateFn)

        console.debug("Qwik-speak: translation loaded");
    });

    return speakState;
};

import { useStore, useContextProvider, immutable, useServerMount$, useClientMount$ } from '@builder.io/qwik';

import { TranslationConfig, TranslationState } from './types';
import { loadTranslation$, TranslationContext } from './constants';
import { getTranslation } from './utils';

export const useTranslation = (config: TranslationConfig): void => {
    // Assign translation functions
    config.translationFn = {
        loadTranslation: config.translationFn?.loadTranslation ?? loadTranslation$
    };

    // Set initial translation state
    const translationState = useStore<TranslationState>({
        locale: { language: config.defaultLocale.language },
        translation: {},
        config: config
    }, { recursive: true });
    const { locale: { language }, locale, translation } = translationState;

    // Will block on the server the rendering of the app until callback resolves
    useServerMount$(async () => {
        // Load translation data
        await getTranslation(language, config, translation);

        // Prevent Qwik from creating subscriptions on translation data & config
        immutable(translation);
        immutable(config);

        console.debug("Qwik-translate: translation loaded");
    });

    // Will block on the client the rendering of the app until callback resolves
    useClientMount$(async () => {
        // Load translation data
        await getTranslation(language, config, translation);

        console.debug("Qwik-translate: translation loaded");
    });

    useContextProvider(TranslationContext, translationState);
};



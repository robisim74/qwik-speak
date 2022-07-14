import { useStore, useContextProvider, immutable, useMount$ } from '@builder.io/qwik';

import { TranslateConfig, TranslateFn, TranslateState } from './types';
import { getUserLanguage$, loadTranslation$, readLocale$, TranslateContext, writeLocale$ } from './constants';
import { getTranslation } from './utils';

export const useTranslate = (config: TranslateConfig, translateFn: TranslateFn = {}): void => {
    // Assign functions
    translateFn.loadTranslation$ = translateFn.loadTranslation$ ?? loadTranslation$;
    translateFn.getUserLanguage$ = translateFn.getUserLanguage$ ?? getUserLanguage$;
    translateFn.writeLocale$ = translateFn.writeLocale$ ?? writeLocale$;
    translateFn.readLocale$ = translateFn.readLocale$ ?? readLocale$;

    // Set initial state
    const translateState = useStore<TranslateState>({
        locale: {},
        translation: {},
        config: config,
        translateFn: translateFn
    }, { recursive: true });
    const { locale, translation } = translateState;

    useContextProvider(TranslateContext, translateState);

    // Will block the rendering of the app until callback resolves
    useMount$(async () => {
        // Try to get locale from the storage
        let userLocale = await translateFn.readLocale$?.();

        // Try to get locale by user language
        if (!userLocale){
            const userLanguage = await translateFn.getUserLanguage$?.();
            userLocale = config.supportedLocales.find(x => x.language == userLanguage);
        }

        // Use default locale
        if (!userLocale){
            userLocale = config.defaultLocale;
        }

        // Set locale
        Object.assign(locale, userLocale);

        // Load translation data
        await getTranslation(locale.language!, translateState);

        // Prevent Qwik from creating subscriptions
        immutable(translation);
        immutable(config);
        immutable(translateFn)

        console.debug("Qwik-translate: translation loaded");
    });
};



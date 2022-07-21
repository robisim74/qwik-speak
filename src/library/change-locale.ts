import type { Locale, SpeakState } from './types';
import { loadTranslation, qDev } from './utils';

/**
 * Change locale at runtime
 * @param changedLocale 
 * @param ctx 
 */
export const changeLocale = async (changedLocale: Locale, ctx: SpeakState): Promise<void> => {
    const { locale, translateFn } = ctx;

    // Load translation data
    await loadTranslation(changedLocale, ctx);

    // Release locale & rerendering components
    Object.assign(locale, changedLocale);

    // Store the locale
    await translateFn.setLocale$?.(changedLocale);

    if (qDev) {
        console.debug('%cQwik Speak', 'background-color: #0093ee; color: #fff; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;', ctx);
    }
};

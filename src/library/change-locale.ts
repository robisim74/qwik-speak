import type { Locale, SpeakState } from './types';
import { loadTranslation, formatLanguage } from './core';
import { qDev } from './utils';

/**
 * Change locale at runtime
 * @param newLocale 
 * @param ctx 
 */
export const changeLocale = async (newLocale: Locale, ctx: SpeakState): Promise<void> => {
    const { locale, translation, config, translateFn } = ctx;
    if (!locale.language) return;

    const language = formatLanguage(locale.language, config.languageFormat);

    // Load translation data
    const newTranslation = await loadTranslation(newLocale.language, ctx);

    // Update state
    delete translation[language]; // Delete old translation
    Object.assign(translation, newTranslation);
    Object.assign(locale, newLocale);

    // Store the locale
    await translateFn.setLocale$?.(newLocale);

    if (qDev) {
        console.debug('%cQwik Speak', 'background-color: #0093ee; color: #fff; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;', ctx);
    }
};

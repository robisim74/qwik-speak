import type { SpeakLocale, SpeakState } from './types';
import { loadTranslation } from './core';
import { qDev } from './utils';

/**
 * Change locale at runtime: loads translation data and rerenders components that uses translations
 * @param newLocale The new locale to set
 * @param ctx Speak context
 */
export const changeLocale = async (newLocale: SpeakLocale, ctx: SpeakState): Promise<void> => {
  const { locale, translation, translateFn } = ctx;

  // Load translation data
  const newTranslation = await loadTranslation(newLocale.lang, ctx);

  // Update state
  delete translation[locale.lang]; // Delete old translation
  Object.assign(translation, newTranslation);
  Object.assign(locale, newLocale);

  // Set the locale
  await translateFn.setLocale$?.(newLocale);

  if (qDev) {
    console.debug('%cQwik Speak',
      'background-color: #0093ee; color: #fff; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;',
      ctx);
  }
};

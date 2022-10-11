import type { SpeakLocale, SpeakState } from './types';
import { loadTranslation } from './core';

/**
 * Change locale at runtime: loads translation data and rerenders components that uses translations
 * @param newLocale The new locale to set
 * @param ctx Speak context
 */
export const changeLocale = async (
  newLocale: SpeakLocale,
  ctx: SpeakState
): Promise<void> => {
  const { locale, translation, translateFn } = ctx;

  // Store the locale
  await translateFn.storeLocale$(newLocale);

  // Load translation data
  const loadedTranslation = await loadTranslation(newLocale.lang, ctx);

  // Update state
  Object.assign(translation, loadedTranslation);
  Object.assign(locale, newLocale);
};

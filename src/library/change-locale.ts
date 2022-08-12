import { RouteLocation } from '@builder.io/qwik-city';

import type { SpeakLocale, SpeakState } from './types';
import { loadTranslation } from './core';
import { qDev } from './utils';

/**
 * Change locale at runtime: loads translation data and rerenders components that uses translations
 * @param newLocale The new locale to set
 * @param ctx Speak context
 * @param location Qwik City location context
 */
export const changeLocale = async (
  newLocale: SpeakLocale,
  ctx: SpeakState,
  location?: RouteLocation
): Promise<void> => {
  const { locale, translation, translateFn } = ctx;

  // Load translation data
  const loadedTranslation = await loadTranslation(newLocale.lang, ctx, location);

  // Update state
  Object.assign(translation, loadedTranslation);
  Object.assign(locale, newLocale);

  // Store the locale
  await translateFn.storeLocale$(newLocale);

  if (qDev) {
    console.debug('%cQwik Speak',
      'background-color: #0093ee; color: #fff; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;',
      ctx);
  }
};

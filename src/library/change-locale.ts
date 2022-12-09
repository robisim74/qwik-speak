import type { SpeakLocale, SpeakState } from './types';

/**
 * Change locale at runtime: loads translation data and rerenders components that uses translations
 * @param newLocale The new locale to set
 * @param ctx Speak context
 */
export const changeLocale = async (newLocale: SpeakLocale, ctx: SpeakState): Promise<void> => {
  const { locale } = ctx;

  // Update state
  Object.assign(locale, newLocale);
};

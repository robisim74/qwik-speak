import type { SpeakLocale, SpeakState } from './types';

/**
 * Change locale at runtime: loads translation data and rerenders components that uses translations.
 * Fallback to the default locale if the new locale is not in supported locales
 * @param newLocale The new locale to set
 * @param ctx Speak context
 */
export const changeLocale = async (newLocale: SpeakLocale, ctx: SpeakState): Promise<void> => {
  const { locale, config } = ctx;

  // Update state
  if (config.supportedLocales.find(value => value.lang === newLocale.lang)) {
    Object.assign(locale, newLocale);
  } else {
    Object.assign(locale, config.defaultLocale);
  }
};

import type { SpeakLocale, SpeakState } from './types';

/**
 * Change locale at runtime: loads translation data and rerenders components that uses translations
 * @param newLocale The new locale to set
 * @param ctx Speak context
 */
export const changeLocale = async (newLocale: SpeakLocale, ctx: SpeakState): Promise<void> => {
  const { locale, config } = ctx;

  // Resolve locale
  const resolvedLocale = config.supportedLocales.find(value => value.lang === newLocale.lang) ?
    newLocale :
    config.defaultLocale;

  // Update state
  Object.assign(locale, resolvedLocale);
};

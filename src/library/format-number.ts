import type { SpeakLocale } from './types';
import { useSpeakLocale } from './use-functions';

/**
 * Format a number
 * @param value A number or a string
 * @param options Intl NumberFormatOptions object
 * @param locale Optional Speak locale to be provided outside the component$
 * @param lang Optional language if different from the current one
 * @param currency Optional currency if different from the current one
 * @returns The formatted number
 */
export const formatNumber = (
  value: number | string,
  options?: Intl.NumberFormatOptions,
  locale?: SpeakLocale,
  lang?: string,
  currency?: string
): string => {
  locale = locale ?? useSpeakLocale();

  lang = lang ?? locale.extension ?? locale.lang;
  currency = currency ?? locale.currency;

  value = +value;

  options = { ...options };
  if (currency) options.currency = currency;

  return new Intl.NumberFormat(lang, options).format(value);
};

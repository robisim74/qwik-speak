import type { SpeakLocale } from './types';
import { useSpeakLocale } from './use-functions';
import { toNumber } from './utils';

/**
 * Format a number
 * @param value A number or a string
 * @param options Intl NumberFormatOptions object
 * @param locale Speak locale 
 * @param lang 
 * @param currency 
 * @returns 
 */
export const formatNumber = (
  value: any,
  options?: Intl.NumberFormatOptions,
  locale?: SpeakLocale,
  lang?: string,
  currency?: string
): string => {
  locale = locale ?? useSpeakLocale();

  lang = lang ?? locale.extension ?? locale.lang;
  currency = currency ?? locale.currency;

  value = toNumber(value);

  options = { ...options };
  if (currency) options.currency = currency;

  return new Intl.NumberFormat(lang, options).format(value);
}

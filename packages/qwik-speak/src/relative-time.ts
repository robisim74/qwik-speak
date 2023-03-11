import type { SpeakLocale } from './types';
import { useSpeakLocale } from './use-functions';

/**
 * Format a relative time
 * @param value A number or a string
 * @param unit Intl RelativeTimeFormatUnit string
 * @param options Intl RelativeTimeFormatOptions object
 * @param locale Optional Speak locale to be provided outside the component$
 * @param lang Optional language if different from the current one
 */
export const relativeTime = (
  value: number | string,
  unit: Intl.RelativeTimeFormatUnit,
  options?: Intl.RelativeTimeFormatOptions,
  locale?: SpeakLocale,
  lang?: string
) => {
  locale = locale ?? useSpeakLocale();

  lang = lang ?? locale.extension ?? locale.lang;

  value = +value;

  return new Intl.RelativeTimeFormat(lang, options).format(value, unit);
};

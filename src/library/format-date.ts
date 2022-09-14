
import type { SpeakLocale } from './types';
import { useSpeakLocale } from './use-functions';

/**
 * Format a date
 * @param value A date, a number (milliseconds since UTC epoch) or a string
 * @param options Intl DateTimeFormatOptions object
 * @param locale Optional Speak locale to be provided outside the component$
 * @param lang Optional language if different from the current one
 * @param timeZone Optional time zone if different from the current one
 * @returns The formatted date
 */
export const formatDate = (
  value: Date | number | string,
  options?: Intl.DateTimeFormatOptions,
  locale?: SpeakLocale,
  lang?: string,
  timeZone?: string
): string => {
  locale = locale ?? useSpeakLocale();

  lang = lang ?? locale.extension ?? locale.lang;
  timeZone = timeZone ?? locale.timeZone;

  value = new Date(value);

  options = { ...options };
  if (timeZone) options.timeZone = timeZone;

  return new Intl.DateTimeFormat(lang, options).format(value);
};

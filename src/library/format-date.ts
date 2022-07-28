
import type { SpeakLocale } from './types';
import { useSpeakLocale } from './use-functions';
import { toDate } from './utils';

/**
 * Format a date
 * @param value A date, a number (milliseconds since UTC epoch) or an ISO 8601 string
 * @param options Intl DateTimeFormatOptions object
 * @param locale Speak locale
 * @param lang 
 * @param timeZone 
 * @returns 
 */
export const formatDate = (
  value: any,
  options?: Intl.DateTimeFormatOptions,
  locale?: SpeakLocale,
  lang?: string,
  timeZone?: string
): string => {
  locale = locale ?? useSpeakLocale();

  lang = lang ?? locale.extension ?? locale.lang;
  timeZone = timeZone ?? locale.timeZone;

  value = toDate(value);

  options = { ...options };
  if (timeZone) options.timeZone = timeZone;

  return new Intl.DateTimeFormat(lang, options).format(value);
}

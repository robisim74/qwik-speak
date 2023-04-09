import type { SpeakLocale } from './types';
import { useSpeakLocale } from './use-functions';

/**
 * Return the translation of language, region, script or currency display names
 * @param code ISO code of language, region, script or currency
 * @param options Intl DisplayNamesOptions object
 * @param locale Optional Speak locale to be provided outside the component$
 * @param lang Optional language if different from the current one
 * @returns The translated code
 */
export const displayName = (
  code: string,
  options: Intl.DisplayNamesOptions,
  locale?: SpeakLocale,
  lang?: string
): string => {
  locale = locale ?? useSpeakLocale();

  lang = lang ?? locale.extension ?? locale.lang;

  return new Intl.DisplayNames(lang, options).of(code) || code;
};

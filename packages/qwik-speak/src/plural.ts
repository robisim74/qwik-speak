import type { SpeakState } from './types';
import { useSpeakContext } from './use-functions';
import { $translate } from './translate';

/**
 * Get the plural by a number. 
 * The value is passed as a parameter to the translate function
 * @param value A number or a string
 * @param key Optional key
 * @param params Optional parameters contained in the values
 * @param options Intl PluralRulesOptions object
 * @param ctx Optional Speak context to be provided outside the component$
 * @param lang Optional language if different from the current one
 * @returns The translation for the plural
 */
export const $plural = (
  value: number | string,
  key?: string,
  params?: any,
  options?: Intl.PluralRulesOptions,
  ctx?: SpeakState,
  lang?: string
): string => {
  ctx = ctx ?? useSpeakContext();
  const { locale, config } = ctx;

  lang = lang ?? locale.lang;

  value = +value;

  const rule = new Intl.PluralRules(lang, options).select(value);
  key = key ? `${key}${config.keySeparator}${rule}` : rule;

  return $translate(key, { value, ...params }, ctx, lang);
};

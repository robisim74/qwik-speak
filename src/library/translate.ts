import type { SpeakState } from './types';
import { useSpeakContext } from './use-functions';
import { getValue } from './core';

/**
 * Translate a key or an array of keys.
 * The syntax of the string is 'key@@[default value]'
 * @param keys The key or an array of keys to translate
 * @param params Optional parameters contained in the value
 * @param ctx Optional Speak context to be provided outside the component$
 * @param lang Optional language if different from the current one
 * @returns The translated values
 */
export const $translate = (
  keys: string | string[],
  params?: any,
  ctx?: SpeakState,
  lang?: string
): string | string[] | any => {
  ctx = ctx ?? useSpeakContext();
  const { locale, translation, config, translateFn } = ctx;

  lang = lang ?? locale.lang;

  if (Array.isArray(keys)) {
    const values = keys.map(key => $translate(key, params, ctx, lang));
    return values;
  }

  const value = getValue(keys, translation[lang], params, config.keySeparator);

  return value || translateFn.handleMissingTranslation$(keys, value, params, ctx);
};

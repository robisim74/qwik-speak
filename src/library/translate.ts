import type { SpeakState } from './types';
import { useSpeakContext } from './use-functions';
import { getValue } from './core';

/**
 * Translate a key.
 * The syntax of the string is 'key@@[default value]'
 * @param key The key to translate
 * @param params Optional parameters contained in the value
 * @param ctx Optional Speak context to be provided outside the component$
 * @param lang Optional language if different from the current one
 * @returns The translation or the key if not found
 */
export function $translate(key: string, params?: any, ctx?: SpeakState, lang?: string): string;
/**
 * Translate an array of keys.
 * The syntax of the strings is 'key@@[default value]'
 * @param keys The array of keys to translate
 * @param params Optional parameters contained in the values
 * @param ctx Optional Speak context to be provided outside the component$
 * @param lang Optional language if different from the current one
 * @returns The translations or the keys if not found
 */
export function $translate(keys: string[], params?: any, ctx?: SpeakState, lang?: string): string[];

export function $translate(keys: string | string[], params?: any, ctx?: SpeakState, lang?: string): any {
  ctx = ctx ?? useSpeakContext();
  const { locale, translation, config } = ctx;

  lang = lang ?? locale.lang;

  if (Array.isArray(keys)) {
    return keys.map(key => $translate(key, params, ctx, lang));
  }

  return getValue(keys, translation[lang], params, config.keySeparator) || keys;
}

import type { InternalSpeakState, SpeakState } from './types';
import { useSpeakContext } from './use-functions';
import { getValue, handleParams } from './core';

/**
 * Translate a key or an array of keys
 * @param keys The key or an array of keys to translate
 * @param params Optional parameters contained in the value
 * @param ctx Optional Speak context to be provided outside the component$
 * @param lang Optional language if different from the current one
 * @returns The translated values
 */
export const translate = (keys: string | string[], params?: any, ctx?: SpeakState, lang?: string): string | any => {
  ctx = ctx ?? useSpeakContext();
  const { locale, translation, config, translateFn } = ctx;

  // Rerender if the state has changed
  const { $flags$ } = <InternalSpeakState>ctx;

  lang = lang ?? locale.lang;

  if (Array.isArray(keys)) {
    const data: { [key: string]: any } = {};
    for (const key of keys) {
      data[key] = translate(key, params, ctx, lang);
    }
    return data;
  }

  const value = getValue(keys, translation[lang], config.keySeparator);

  return value ? handleParams(value, params) : translateFn.handleMissingTranslation$?.(keys, value, params);
}

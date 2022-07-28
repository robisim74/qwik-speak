import type { SpeakState } from './types';
import { useSpeakContext } from './use-functions';
import { getValue, handleParams } from './core';

/**
 * Translate a key or an array of keys
 * @param keys The key or an array of keys to be translated
 * @param params Optional parameters contained in the value
 * @param ctx Speak context
 * @param lang 
 * @returns The translated value or an object: {key: value}
 */
export const translate = (keys: string | string[], params?: any, ctx?: SpeakState, lang?: string): string | any => {
  ctx = ctx ?? useSpeakContext();
  const { locale, translation, config, translateFn } = ctx;

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

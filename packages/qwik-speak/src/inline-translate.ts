import type { SpeakState } from './types';
import { getValue } from './core';
import { _speakContext, getLang } from './context';

export type InlineTranslateFn = {
  /**
   * Translate a key.
   * The syntax of the string is 'key@@[default value]'
   * @param key The key to translate
   * @param params Optional parameters contained in the value
   * @param lang Optional language if different from the current one
   * @returns The translation or the key if not found
   */
  (key: string, params?: Record<string, any>, lang?: string): string;
  <T>(key: string, params?: Record<string, any>, lang?: string): T;
  /**
   * Translate an array of keys.
   * The syntax of the strings is 'key@@[default value]'
   * @param keys The array of keys to translate
   * @param params Optional parameters contained in the values
   * @param lang Optional language if different from the current one
   * @returns The translations or the keys if not found
   */
  (keys: string[], params?: Record<string, any>, lang?: string): string[];
  <T>(keys: string[], params?: Record<string, any>, lang?: string): T[];
};

export const inlineTranslate = (): InlineTranslateFn => {
  const currentLang = getLang();

  const translate: InlineTranslateFn = (
    keys: string | string[],
    params?: Record<string, any>,
    lang?: string
  ) => {
    const { translation, config } = _speakContext as SpeakState;

    lang ??= currentLang;

    if (Array.isArray(keys)) {
      return keys.map(k => getValue(k, translation[lang!], params, config.keySeparator, config.keyValueSeparator));
    }

    return getValue(keys, translation[lang], params, config.keySeparator, config.keyValueSeparator);
  };

  return translate as InlineTranslateFn;
};

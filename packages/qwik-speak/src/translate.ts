import { useSpeakContext } from './use-speak';
import { translate } from './core';

export type TranslateFn = {
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

export const $translate: TranslateFn = (keys: string | string[], params?: Record<string, any>, lang?: string) => {
  const ctx = useSpeakContext();
  const { locale, translation, config } = ctx;

  lang ??= locale.lang;

  return translate(keys, translation[lang], params, config.keySeparator, config.keyValueSeparator);
}

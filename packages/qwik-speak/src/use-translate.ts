import { useSpeakContext } from './use-speak';
import { getValue } from './core';
import { TranslationType } from './types-safety';

export type TranslateFn<T, D extends string, S extends string> = {
  /**
   * Translate a key.
   * The syntax of the string is 'key@@[default value]'
   * @param key The key to translate
   * @param params Optional parameters contained in the value
   * @param lang Optional language if different from the current one
   * @returns The translation or the key if not found
   */
  (key: TranslationType<T, D, S>, params?: Record<string, any>, lang?: string): string;
  <V = string>(key: TranslationType<T, D, S, V>, params?: Record<string, any>, lang?: string): V;
  /**
   * Translate an array of keys.
   * The syntax of the strings is 'key@@[default value]'
   * @param keys The array of keys to translate
   * @param params Optional parameters contained in the values
   * @param lang Optional language if different from the current one
   * @returns The translations or the keys if not found
   */
  (keys: TranslationType<T, D, S>[], params?: Record<string, any>, lang?: string): string[];
  <V = string>(keys: TranslationType<T, D, S, V>[], params?: Record<string, any>, lang?: string): V[];
};

export const useTranslate = <T = string, D extends string = '.', S extends string = '@@'>(): TranslateFn<T, D, S> => {
  const ctx = useSpeakContext();

  const translate = (keys: string | string[], params?: Record<string, any>, lang?: string) => {
    const { locale, translation, config } = ctx;

    lang ??= locale.lang;

    return getValue(keys, translation[lang], params, config.keySeparator, config.keyValueSeparator);
  };

  return translate as TranslateFn<T, D, S>;
};

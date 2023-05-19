import type { SpeakState } from './types';
import { getValue } from './core';

export type InlineTranslateFn = {
  /**
   * Translate a key outside the component$.
   * The syntax of the string is 'key@@[default value]'
   * @param key The key to translate
   * @param ctx The Speak context
   * @param params Optional parameters contained in the value
   * @param lang Optional language if different from the current one
   * @returns The translation or the key if not found
   */
  (key: string, ctx: SpeakState, params?: Record<string, any>, lang?: string): string;
  <T>(key: string, ctx: SpeakState, params?: Record<string, any>, lang?: string): T;
  /**
   * Translate an array of keys outside the component$.
   * The syntax of the strings is 'key@@[default value]'
   * @param keys The array of keys to translate
   * @param ctx The Speak context
   * @param params Optional parameters contained in the values
   * @param lang Optional language if different from the current one
   * @returns The translations or the keys if not found
   */
  (keys: string[], ctx: SpeakState, params?: Record<string, any>, lang?: string): string[];
  <T>(keys: string[], ctx: SpeakState, params?: Record<string, any>, lang?: string): T[];
};

export const $inlineTranslate: InlineTranslateFn = (
  keys: string | string[],
  ctx: SpeakState,
  params?: Record<string, any>,
  lang?: string
) => {
  const { locale, translation, config } = ctx;

  lang ??= locale.lang;

  return getValue(keys, translation[lang], params, config.keySeparator, config.keyValueSeparator);
};

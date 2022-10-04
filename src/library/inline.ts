import { handleParams, separateKeyValue } from './core';

/**
 * Inline a value outside of component$
 * @param key 'key@@[default value]'
 * @param params Optional parameters contained in the default value
 * @param keyValueSeparator Key-value separator. Default is '@@'
 * @returns The default value or the key
 */
export const $inline = (key: string, params?: any, keyValueSeparator = '@@'): string | string[] | any => {
  let value: string | undefined = undefined;

  [key, value] = separateKeyValue(key, keyValueSeparator);

  return value ? handleParams(value, params) : key;
};

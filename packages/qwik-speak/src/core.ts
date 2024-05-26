import type { Translation } from './types';

/**
 * Get translation value
 */
export const getValue = (
  key: string,
  data: Translation,
  params?: Record<string, any>,
  keySeparator = '.',
  keyValueSeparator = '@@',
) => {
  let defaultValue: string | undefined = undefined;

  [key, defaultValue] = separateKeyValue(key, keyValueSeparator);

  const value = key.split(keySeparator).reduce((acc, cur) =>
    (acc && acc[cur] !== undefined) ?
      acc[cur] :
      undefined, data);

  if (value) {
    if (typeof value === 'string')
      return params ? transpileParams(value, params) : value;
    if (typeof value === 'object')
      return params ? JSON.parse(transpileParams(JSON.stringify(value), params)) : value;
  }

  if (defaultValue) {
    if (!/^[[{].*[\]}]$/.test(defaultValue) || /^{{/.test(defaultValue))
      return params ? transpileParams(defaultValue, params) : defaultValue;
    // Default value is an array/object
    return params ? JSON.parse(transpileParams(defaultValue, params)) : JSON.parse(defaultValue);
  }

  return key;
}

/**
 * Separate key & default value
 */
export const separateKeyValue = (key: string, keyValueSeparator = '@@'): [string, string | undefined] => {
  return <[string, string | undefined]>key.split(keyValueSeparator);
};

/**
 * Replace params in the value
 */
export const transpileParams = (value: string, params: Record<string, any>): string => {
  const replacedValue = value.replace(/{{\s?([^{}\s]*)\s?}}/g, (substring: string, parsedKey: string) => {
    const replacer = params[parsedKey];
    return replacer !== undefined ? replacer : substring;
  });
  return replacedValue;
};

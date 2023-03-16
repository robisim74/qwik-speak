import type { Translation, SpeakState } from './types';

/**
 * Load translations
 */
export const loadTranslations = async (
  ctx: SpeakState,
  assets: string[],
  langs?: string[],
  origin?: string,
): Promise<void> => {
  const { locale, translation, translationFn } = ctx;

  // Multilingual
  const resolvedLangs = new Set(langs || []);
  resolvedLangs.add(locale.lang);

  for (const lang of resolvedLangs) {
    const tasks = assets.map(asset => translationFn.loadTranslation$(lang, asset, origin));
    const sources = await Promise.all(tasks);

    for (const data of sources) {
      if (data) Object.assign(translation[lang], data); // Shallow merge
    }
  }
};

/**
 * Get the value of a key
 */
export const getValue = (
  key: string,
  data: Translation,
  params?: any,
  keySeparator = '.',
  keyValueSeparator = '@@'
): string | Translation | undefined => {
  let defaultValue: string | undefined = undefined;

  [key, defaultValue] = separateKeyValue(key, keyValueSeparator);

  const value = key.split(keySeparator).reduce((acc, cur) =>
    (acc && acc[cur] !== undefined) ?
      acc[cur] :
      undefined, data);

  if (value) {
    if (typeof value === 'string') return params ? transpileParams(value, params) : value;
    if (typeof value === 'object') return value;
  }

  if (defaultValue) {
    if (!/^[[{].*[\]}]$/.test(defaultValue) || /^{{/.test(defaultValue))
      return params ? transpileParams(defaultValue, params) : defaultValue;
    // Default value is an array/object
    return JSON.parse(defaultValue);
  }

  return undefined;
};

/**
 * Separate key & value
 */
export const separateKeyValue = (key: string, keyValueSeparator: string): [string, string | undefined] => {
  return <[string, string | undefined]>key.split(keyValueSeparator);
};

/**
 * Replace params in the value
 */
export const transpileParams = (value: string, params: any): string => {
  const replacedValue = value.replace(/{{\s?([^{}\s]*)\s?}}/g, (substring: string, parsedKey: string) => {
    const replacer = params[parsedKey];
    return replacer !== undefined ? replacer : substring;
  });
  return replacedValue;
};

import type { Translation, SpeakState } from './types';

/**
 * Load translation data for the language
 */
export const loadTranslation = async (
  lang: string,
  ctx: SpeakState,
  url?: URL,
  assets?: string[]
): Promise<Translation> => {
  const { config, translateFn } = ctx;

  assets = assets ?? config.assets;
  // Get translation
  const tasks = assets.map(asset => translateFn.loadTranslation$(lang, asset, url));
  const sources = await Promise.all(tasks);

  const translation: Translation = {};
  for (const data of sources) {
    if (data) {
      addData(translation, data, lang)
    }
  }
  return translation;
};

export const addData = (translation: Translation, data: Translation, lang: string): void => {
  translation[lang] = translation[lang] !== undefined
    ? { ...translation[lang], ...data } // Shallow merge
    : data;
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
): string | undefined => {
  let defaultValue: string | undefined = undefined;

  [key, defaultValue] = separateKeyValue(key, keyValueSeparator);

  const value = key.split(keySeparator).reduce((acc, cur) => (acc && acc[cur] != null) ? acc[cur] : null, data);

  if (typeof value === 'string') return params ? handleParams(value, params) : value;

  return defaultValue ? handleParams(defaultValue, params) : defaultValue;
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
export const handleParams = (value: string, params: any): string => {
  const replacedValue = value.replace(/{{\s?([^{}\s]*)\s?}}/g, (substring: string, parsedKey: string) => {
    const replacer = params[parsedKey];
    return replacer !== undefined ? replacer : substring;
  });
  return replacedValue;
};

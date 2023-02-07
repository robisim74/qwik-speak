import type { Translation, SpeakState, LoadTranslationFn } from './types';

const cache: Record<string, Promise<any>> = {};

/**
 * In SPA mode, cache the results
 */
export const memoize = (fn: LoadTranslationFn) => {
  return (...args: [string, string, string | undefined]) => {
    const stringArgs = JSON.stringify(args);

    return stringArgs in cache ?
      cache[stringArgs] :
      cache[stringArgs] = fn(...args);
  };
};

/**
 * Load translations
 */
export const loadTranslations = async (
  ctx: SpeakState,
  origin?: string,
  langs?: string[],
  assets?: string[]
): Promise<void> => {
  const { locale, translation, config, translationFn } = ctx;

  assets = assets ?? config.assets;

  // Multilingual
  const resolvedLangs = new Set(langs || []);
  resolvedLangs.add(locale.lang);

  for (const lang of resolvedLangs) {
    const memoized = memoize(translationFn.loadTranslation$);
    const tasks = assets.map(asset => memoized(lang, asset, origin));
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
): string | undefined => {
  let defaultValue: string | undefined = undefined;

  [key, defaultValue] = separateKeyValue(key, keyValueSeparator);

  const value = key.split(keySeparator).reduce((acc, cur) =>
    (acc && acc[cur] !== undefined) ?
      acc[cur] :
      undefined, data);

  if (typeof value === 'string') return params ? transpileParams(value, params) : value;

  return defaultValue ? transpileParams(defaultValue, params) : undefined;
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

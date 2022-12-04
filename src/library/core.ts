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
      (cache[stringArgs] = fn(...args).catch((x) => {
        delete cache[stringArgs];
        return x;
      }));
  };
};

/**
 * Load translation data
 */
export const loadTranslation = async (
  lang: string,
  ctx: SpeakState,
  origin?: string,
  assets?: string[]
): Promise<Translation> => {
  const { config, translationFn } = ctx;

  assets = assets ?? config.assets;
  // Get translation
  const memoized = memoize(translationFn.loadTranslation$);
  const tasks = assets.map(asset => memoized(lang, asset, origin));
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

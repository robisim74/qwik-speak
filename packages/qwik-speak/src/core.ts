import { noSerialize } from '@builder.io/qwik';
import { isDev, isServer } from '@builder.io/qwik/build';

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
 * Load translations when: 
 * - dev mode
 * - on server
 * - or runtime assets
 * In prod mode, assets are not serialized
 */
export const loadTranslations = async (
  ctx: SpeakState,
  assets: string[],
  runtimeAssets?: string[],
  langs?: string[],
  origin?: string
): Promise<void> => {
  if (isDev === true || isServer || runtimeAssets) {
    const { locale, translation, translationFn } = ctx;

    let resolvedAssets: string[];
    if (isDev === true || isServer) {
      resolvedAssets = [...assets, ...runtimeAssets ?? []];
    } else {
      resolvedAssets = [...runtimeAssets ?? []];
    }

    // Multilingual
    const resolvedLangs = new Set(langs || []);
    resolvedLangs.add(locale.lang);

    for (const lang of resolvedLangs) {
      const memoized = memoize(translationFn.loadTranslation$);
      const tasks = resolvedAssets.map(asset => memoized(lang, asset, origin));
      const sources = await Promise.all(tasks);
      const assetSources = sources.map((source, i) => ({
        asset: resolvedAssets[i],
        source: source
      }));

      for (const data of assetSources) {
        if (data?.source) {
          if (!isDev && isServer && assets.includes(data.asset)) {
            // In prod mode, assets are not serialized
            for (let [key, value] of Object.entries<Translation>(data.source)) {
              // Depth 0: convert string to String object
              if (typeof value === 'string') {
                value = new String(value);
              }
              translation[lang][key] = noSerialize(value);
            }
          } else {
            // Serialize whether dev mode, or runtime assets
            Object.assign(translation[lang], data.source);
          }
        }
      }
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
    if (typeof value === 'string' || value instanceof String)
      return params ? transpileParams(value.toString(), params) : value.toString();
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

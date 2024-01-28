import type { ValueOrPromise } from '@builder.io/qwik';
import { isDev, isServer } from '@builder.io/qwik/build';

import type { LoadTranslationFn, SpeakState, Translation } from './types';
import { getSpeakContext } from './context';
import { logWarn } from './log';

const cache: Record<string, ValueOrPromise<Translation | null>> = {};

/**
 * Cache the requests on server and on client in SPA mode
 */
export const memoize = (fn: LoadTranslationFn) => {
  return (...args: [string, string]) => {
    const stringArgs = JSON.stringify(args);

    return stringArgs in cache ?
      cache[stringArgs] :
      cache[stringArgs] = fn(...args);
  };
};

/**
 * Load translations when:
 * - on server
 * - or runtime assets
 * runtimeAssets are serialized
 */
export const loadTranslations = async (
  ctx: SpeakState,
  assets?: string[],
  runtimeAssets?: string[],
  langs?: string[]
): Promise<void> => {
  if (isServer || runtimeAssets) {
    const { locale, translation, translationFn, config } = ctx;
    // Qwik Speak server/client context
    const { translation: _translation } = getSpeakContext();

    if (isDev) {
      const conflictingAsset = assets?.find(asset => runtimeAssets?.includes(asset)) ||
        assets?.find(asset => config.runtimeAssets?.includes(asset)) ||
        runtimeAssets?.find(asset => config.assets?.includes(asset));
      if (conflictingAsset) {
        logWarn(`Conflict between assets and runtimeAssets '${conflictingAsset}'`);
      }
    }

    let resolvedAssets: string[];
    if (isServer) {
      resolvedAssets = [...assets ?? [], ...runtimeAssets ?? []];
    } else {
      resolvedAssets = [...runtimeAssets ?? []];
    }
    if (resolvedAssets.length === 0) return;

    // Multilingual
    const resolvedLangs = new Set(langs || []);
    resolvedLangs.add(locale.lang);

    for (const lang of resolvedLangs) {
      let tasks: ValueOrPromise<Translation | null>[];
      // Cache requests in prod mode
      if (!isDev) {
        const memoized = memoize(translationFn.loadTranslation$);
        tasks = resolvedAssets.map(asset => memoized(lang, asset));
      } else {
        tasks = resolvedAssets.map(asset => translationFn.loadTranslation$(lang, asset));
      }

      const sources = await Promise.all(tasks);
      const assetSources = sources.map((source, i) => ({
        asset: resolvedAssets[i],
        source: source
      }));

      // Set Qwik Speak server/client context
      if (!(lang in _translation)) {
        Object.assign(_translation, { [lang]: {} });
      }

      for (const data of assetSources) {
        if (data?.source) {
          if (isServer) {
            // On server:
            // - assets & runtimeAssets in Qwik Speak server context
            // - runtimeAssets in Qwik context (must be serialized to be passed to the client)
            if (assets?.includes(data.asset)) {
              Object.assign(_translation[lang], data.source);
            } else {
              Object.assign(_translation[lang], data.source);
              // Serialize runtimeAssets
              Object.assign(translation[lang], data.source);
            }
          } else {
            // On client:
            // - assets & runtimeAssets in Qwik Speak client context
            Object.assign(_translation[lang], data.source);
          }
        }
      }
    }
  }
};

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

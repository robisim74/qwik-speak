import { $ } from '@builder.io/qwik';

import type {
  LoadTranslationFn,
  StoreLocaleFn,
  HandleMissingTranslationFn,
  ResolveLocaleFn,
  SpeakState
} from './types';
import { handleParams } from './core';

export const loadTranslation$: LoadTranslationFn = $(() => {
  return null;
});

export const resolveLocale$: ResolveLocaleFn = $(() => {
  return null;
});

export const storeLocale$: StoreLocaleFn = $(() => { });

/**
 * Returns the default value or the key
 */
export const handleMissingTranslation$: HandleMissingTranslationFn = $((
  key: string,
  value?: string,
  params?: any,
  ctx?: SpeakState
) => {
  if (ctx?.config.keyValueSeparator) {
    [key, value] = key.split(ctx.config.keyValueSeparator);
    if (value) return params ? handleParams(value, params) : value;
  }
  return key;
});

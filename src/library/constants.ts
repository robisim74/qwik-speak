import { $ } from '@builder.io/qwik';

import type { Translation } from './types';
import type { GetTranslationFn, StoreLocaleFn, HandleMissingTranslationFn, ResolveLocaleFn } from './types';
import { clone, isObject } from './utils';

export const getTranslation$: GetTranslationFn = $((lang: string, asset: string | Translation) => {
  return isObject(asset) ? clone((<Translation>asset)[lang]) : null;
});

export const resolveLocale$: ResolveLocaleFn = $(() => {
  return null;
});

export const setLocale$: StoreLocaleFn = $(() => { });

export const handleMissingTranslation$: HandleMissingTranslationFn = $((key: string) => {
  return key;
});

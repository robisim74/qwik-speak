import { $ } from '@builder.io/qwik';

import type { GetTranslationFn, StoreLocaleFn, HandleMissingTranslationFn, ResolveLocaleFn } from './types';

export const getTranslation$: GetTranslationFn = $(() => {
  return null;
});

export const resolveLocale$: ResolveLocaleFn = $(() => {
  return null;
});

export const setLocale$: StoreLocaleFn = $(() => { });

export const handleMissingTranslation$: HandleMissingTranslationFn = $((key: string) => {
  return key;
});

import { $ } from '@builder.io/qwik';

import type { LoadTranslationFn, StoreLocaleFn, HandleMissingTranslationFn, ResolveLocaleFn } from './types';

export const loadTranslation$: LoadTranslationFn = $(() => {
  return null;
});

export const resolveLocale$: ResolveLocaleFn = $(() => {
  return null;
});

export const setLocale$: StoreLocaleFn = $(() => { });

export const handleMissingTranslation$: HandleMissingTranslationFn = $((key: string) => {
  return key;
});

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

export const handleMissingTranslation$: HandleMissingTranslationFn = $((key: string) => {
  return key;
});

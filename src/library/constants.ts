import { $ } from '@builder.io/qwik';

import type { Translation, SpeakLocale } from './types';
import type { GetTranslationFn, SetLocaleFn, HandleMissingTranslationFn, ResolveLocaleFn } from './types';
import { clone, isObject } from './utils';

export const getTranslation$: GetTranslationFn = $((lang: string, asset: string | Translation) => {
  return isObject(asset) ? clone((<Translation>asset)[lang]) : null;
});

export const resolveLocale$: ResolveLocaleFn = $(() => {
  return null;
});

export const setLocale$: SetLocaleFn = $((locale: SpeakLocale) => { });

export const handleMissingTranslation$: HandleMissingTranslationFn = $((key: string, value?: string, params?: any) => {
  return key;
});

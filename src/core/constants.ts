import { createContext, $ } from '@builder.io/qwik';

import type { GetUserLanguageFn, LoadTranslationFn, Translation, SpeakState, WriteLocaleFn, ReadLocaleFn, Locale } from './types';
import { isObject } from './utils';

export const SpeakContext = createContext<SpeakState>('qwik.speak.state');

export const loadTranslation$: LoadTranslationFn = $((language: string, asset: string | Translation) => {
    return isObject(asset) ? (<Translation>asset)[language] : null;
});

export const getUserLanguage$: GetUserLanguageFn = $(() => {
    return new Intl.DateTimeFormat().resolvedOptions().locale;
});

export const writeLocale$: WriteLocaleFn = $((locale: Locale) => { });

export const readLocale$: ReadLocaleFn = $(() => {
    return null;
});

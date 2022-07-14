import { createContext, $ } from '@builder.io/qwik';

import type { GetUserLanguageFn, LoadTranslationFn, Translation, TranslateState, WriteLocaleFn, ReadLocaleFn, Locale } from './types';
import { isObject } from './utils';

export const TranslateContext = createContext<TranslateState>('qwik.translate.state');

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

import { createContext, $ } from '@builder.io/qwik';

import type { GetUserLanguageFn, GetTranslationFn, Translation, SpeakState, SetLocaleFn, GetLocaleFn, Locale, HandleMissingTranslationFn } from './types';
import { clone, isObject } from './utils';

export const SpeakContext = createContext<SpeakState>('qwik.speak.state');

export const getTranslation$: GetTranslationFn = $((language: string, asset: string | Translation) => {
    return isObject(asset) ? clone((<Translation>asset)[language]) : null;
});

export const getUserLanguage$: GetUserLanguageFn = $(() => {
    return null;
});

export const setLocale$: SetLocaleFn = $((locale: Partial<Locale>) => { });

export const getLocale$: GetLocaleFn = $(() => {
    return null;
});

export const handleMissingTranslation$: HandleMissingTranslationFn = $((key: string, value?: string, params?: any) => {
    return key;
});

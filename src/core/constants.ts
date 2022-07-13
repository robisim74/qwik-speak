import { createContext, $ } from '@builder.io/qwik';

import type { LoadTranslationFn, Translation, TranslationState } from './types';
import { isObject } from './utils';

export const TranslationContext = createContext<TranslationState>('qwik.translate.state');

export const loadTranslation$: LoadTranslationFn = $((language: string, asset: string | Translation) => {
    return isObject(asset) ? (<Translation>asset)[language] : null;
});


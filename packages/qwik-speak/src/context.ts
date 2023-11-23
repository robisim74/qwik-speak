import { createContextId } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';

import type { SpeakState } from './types';

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

/**
 * Qwik context (per user)
 */
export const SpeakContext = createContextId<SpeakState>('qwik-speak');

/**
 * Qwik Speak server context (shared)
 */
const _speakServerContext: DeepPartial<SpeakState> = {
    translation: {},
    config: {}
};

/**
 * Qwik Speak client context (per user)
 */
const _speakClientContext: DeepPartial<SpeakState> = {
    translation: {},
    config: {},
    locale: {}
};

/**
 * Return Qwik Speak server or client context
 */
export const getSpeakContext = (): SpeakState => {
    if (isServer) {
        return _speakServerContext as SpeakState;
    } else {
        return _speakClientContext as SpeakState;
    }
}

/**
 * Qwik Speak function to get language
 */
export let getLang = (): string => '';

/**
 * Set getLang function
 * @param fn 
 */
export const setGetLangFn = (fn: () => string) => {
    getLang = () => fn();
};

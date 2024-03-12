import { createContextId } from '@builder.io/qwik';
import { isBrowser, isServer } from '@builder.io/qwik/build';

import type { SpeakConfig, SpeakLocale, SpeakState, Translation } from './types';

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
 * Set Qwik Speak server context
 * @param config Speak configuration 
 */
export const setSpeakServerContext = (config: SpeakConfig) => {
    if (isServer) {
        const { config: _config } = getSpeakContext();
        Object.assign(_config, config);
    }
};

/**
 * Set Qwik Speak client context
 * @param locale Current locale
 * @param translation Translation data
 * @param config Speak configuration 
 */
export const setSpeakClientContext = (locale: SpeakLocale, translation: Translation, config: SpeakConfig) => {
    if (isBrowser) {
        const _speakContext = getSpeakContext();
        const { locale: _locale, translation: _translation, config: _config } = _speakContext;
        Object.assign(_locale, locale);
        Object.assign(_translation, translation);
        Object.assign(_config, config);
    }
};

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

export { setSpeakServerContext as setSpeakContext };

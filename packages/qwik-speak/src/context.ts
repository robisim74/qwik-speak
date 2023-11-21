import { createContextId } from '@builder.io/qwik';

import type { SpeakState } from './types';

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export const SpeakContext = createContextId<SpeakState>('qwik-speak');

/**
 * Shared server/client context:
 * - config
 * - translation
 */
export const _speakContext: DeepPartial<SpeakState> = {
    translation: {},
    config: {}
};

export let getLang = (): string => '';

export const setGetLangFn = (fn: () => string) => {
    getLang = () => fn();
};

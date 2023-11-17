import { createContextId } from '@builder.io/qwik';

import type { SpeakState } from './types';

export const SpeakContext = createContextId<SpeakState>('qwik-speak');

/**
 * Shared server/client context:
 * - config
 * - translation
 */
export const _speakContext: Partial<SpeakState> = {};

export let getLang = (): string => '';

export const setGetLangFn = (fn: () => string) => {
    getLang = () => fn();
};

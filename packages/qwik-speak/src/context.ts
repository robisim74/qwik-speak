import { createContextId } from '@builder.io/qwik';

import type { SpeakState } from './types';

export const SpeakContext = createContextId<SpeakState>('qwik-speak');

export const _speakContext: Partial<SpeakState> = {};

import { createContextId } from '@builder.io/qwik';

import type { SpeakState } from './types';

export const SpeakContext = createContextId<SpeakState>('qwikspeak');

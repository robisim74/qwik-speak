import { createContext } from '@builder.io/qwik';

import type { SpeakState } from './types';

export const SpeakContext = createContext<SpeakState>('qwikspeak');

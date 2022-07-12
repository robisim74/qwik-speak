import { createContext } from '@builder.io/qwik';

import type { TranslationState } from './types';

export const TranslationContext = createContext<TranslationState>('qwik.translate.state');



import { $ } from '@builder.io/qwik';

import type {
  LoadTranslationFn,
  ResolveLocaleFn
} from './types';

export const loadTranslation$: LoadTranslationFn = $(() => null);

export const resolveLocale$: ResolveLocaleFn = $(() => null);

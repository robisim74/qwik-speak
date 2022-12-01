import { $ } from '@builder.io/qwik';

import type {
  LoadTranslationFn,
  StoreLocaleFn,
  ResolveLocaleFn
} from './types';

export const loadTranslation$: LoadTranslationFn = $(() => null);

export const resolveLocale$: ResolveLocaleFn = $(() => null);

export const storeLocale$: StoreLocaleFn = $(() => { });

import { useStore, useContextProvider, useMount$ } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';

import type { SpeakConfig, TranslateFn, SpeakState, InternalSpeakState } from './types';
import { handleMissingTranslation$, getTranslation$, setLocale$, resolveLocale$ } from './constants';
import { SpeakContext } from './context';
import { loadTranslation } from './core';
import { qDev } from './utils';

/**
 * Creates a new Speak context, resolves the locale & loads translation data
 * @param config Speak configuration
 * @param translateFn Translation functions to use
 */
export const useSpeak = (config: SpeakConfig, translateFn: TranslateFn = {}): void => {
  // Assign functions
  translateFn.getTranslation$ = translateFn.getTranslation$ ?? getTranslation$;
  translateFn.resolveLocale$ = translateFn.resolveLocale$ ?? resolveLocale$;
  translateFn.setLocale$ = translateFn.setLocale$ ?? setLocale$;
  translateFn.handleMissingTranslation$ = translateFn.handleMissingTranslation$ ?? handleMissingTranslation$;

  // Set initial state
  const state = useStore<InternalSpeakState>({
    locale: {},
    translation: {},
    config: config,
    translateFn: translateFn,
    $flags$: 0
  }, { recursive: true });
  const ctx = state as SpeakState;
  const { locale, translation } = ctx;

  useContextProvider(SpeakContext, ctx);

  // Will block the rendering until callback resolves
  useMount$(async () => {
    // Resolve the locale
    let resolvedLocale = await translateFn.resolveLocale$?.();

    if (!resolvedLocale) {
      resolvedLocale = config.defaultLocale;
    }

    // Load translation data
    const newTranslation = await loadTranslation(resolvedLocale.lang, ctx);

    // Update state
    Object.assign(translation, newTranslation);
    Object.assign(locale, resolvedLocale);

    // Prevent Qwik from creating subscriptions
    if (isServer) {
      Object.freeze(translation);
      Object.freeze(config);
      Object.freeze(translateFn)
    }

    if (qDev) {
      console.debug('Qwik Speak', '', 'Translation loaded');
    }
  });
};

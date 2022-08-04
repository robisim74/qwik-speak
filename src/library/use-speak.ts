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
 * @param langs Optional additional languages to preload data for
 */
export const useSpeak = (config: SpeakConfig, translateFn: TranslateFn = {}, langs: string[] = []): void => {
  // Assign functions
  translateFn.getTranslation$ = translateFn.getTranslation$ ?? getTranslation$;
  translateFn.resolveLocale$ = translateFn.resolveLocale$ ?? resolveLocale$;
  translateFn.setLocale$ = translateFn.setLocale$ ?? setLocale$;
  translateFn.handleMissingTranslation$ = translateFn.handleMissingTranslation$ ?? handleMissingTranslation$;

  // Set initial state
  const state = useStore<InternalSpeakState>({
    locale: {},
    translation: Object.fromEntries(config.supportedLocales.map(value => [value.lang, {}])),
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

    const resolvedLangs = new Set(langs);
    resolvedLangs.add(resolvedLocale.lang);

    // Load translation data
    for (const lang of resolvedLangs) {
      const newTranslation = await loadTranslation(lang, ctx);
      Object.assign(translation, newTranslation);
    }

    // Change of state
    Object.assign(locale, resolvedLocale);
    state.$flags$ += 1;

    // Prevent Qwik from creating subscriptions
    if (isServer) {
      // Shallow freeze: only applies to the immediate properties of object itself
      Object.freeze(translation);
      Object.freeze(config);
      Object.freeze(translateFn)
    }

    if (qDev) {
      console.debug('Qwik Speak', '', 'Translation loaded');
    }
  });
};

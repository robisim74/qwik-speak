import { component$, Slot, useContextProvider, useMount$, useStore } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';

import type { InternalSpeakState, SpeakConfig, SpeakState, TranslateFn } from './types';
import { loadTranslation$, resolveLocale$, storeLocale$, handleMissingTranslation$ } from './constants';
import { SpeakContext } from './context';
import { loadTranslation } from './core';
import { useUrl } from './use-functions';

export interface QwikSpeakProps {
  /**
   * Speak config
   */
  config: SpeakConfig;
  /**
   * Optional functions to use
   */
  translateFn?: TranslateFn;
  /**
   * Optional additional languages to preload data for
   */
  langs?: string[];
}

export const QwikSpeak = component$((props: QwikSpeakProps) => {
  // Assign functions
  const resolvedTranslateFn: TranslateFn = {
    loadTranslation$: props.translateFn?.loadTranslation$ ?? loadTranslation$,
    resolveLocale$: props.translateFn?.resolveLocale$ ?? resolveLocale$,
    storeLocale$: props.translateFn?.storeLocale$ ?? storeLocale$,
    handleMissingTranslation$: props.translateFn?.handleMissingTranslation$ ?? handleMissingTranslation$
  };

  // Set initial state
  const state = useStore<InternalSpeakState>({
    locale: {},
    translation: Object.fromEntries(props.config.supportedLocales.map(value => [value.lang, {}])),
    config: {
      defaultLocale: props.config.defaultLocale,
      supportedLocales: props.config.supportedLocales,
      assets: [...props.config.assets], // Shallow copy
      keySeparator: props.config.keySeparator || '.',
      keyValueSeparator: props.config.keyValueSeparator || '@@'
    },
    translateFn: resolvedTranslateFn
  }, { recursive: true });
  const ctx = state as SpeakState;
  const { locale, translation, config, translateFn } = ctx;

  useContextProvider(SpeakContext, ctx);

  // Get URL object
  const url = useUrl();

  // Will block the rendering until callback resolves
  useMount$(async () => {
    // Resolve the locale
    let resolvedLocale = await translateFn.resolveLocale$(url);

    if (!resolvedLocale) {
      resolvedLocale = config.defaultLocale;
    }

    // Set global $lang for inlining
    globalThis.$lang = resolvedLocale.lang;

    const resolvedLangs = new Set(props.langs || []);
    resolvedLangs.add(resolvedLocale.lang);

    // Load translation data
    for (const lang of resolvedLangs) {
      const loadedTranslation = await loadTranslation(lang, ctx, url);
      Object.assign(translation, loadedTranslation);
    }

    Object.assign(locale, resolvedLocale);

    // Prevent Qwik from creating subscriptions
    if (isServer) {
      // Shallow freeze: only applies to the immediate properties of object itself
      // https://github.com/BuilderIO/qwik/issues/1631
      /* Object.freeze(translation);
      Object.freeze(config);
      Object.freeze(translateFn) */
    }
  });

  return <Slot />;
});

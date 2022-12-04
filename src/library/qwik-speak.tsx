import { $, component$, Slot, useContextProvider, useEnvData, useMount$, useStore } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';

import type { InternalSpeakState, SpeakConfig, SpeakLocale, SpeakState, TranslationFn } from './types';
import { SpeakContext } from './context';
import { loadTranslation } from './core';

export interface QwikSpeakProps {
  /**
   * Speak config
   */
  config: SpeakConfig;
  /**
   * Optional functions to use
   */
  translationFn?: TranslationFn;
  /**
   * Optional locale to use
   */
  locale?: SpeakLocale;
  /**
   * Optional additional languages to preload data for
   */
  langs?: string[];
}

export const QwikSpeak = component$((props: QwikSpeakProps) => {
  // Assign functions
  const resolvedTranslationFn: TranslationFn = {
    loadTranslation$: props.translationFn?.loadTranslation$ ?? $(() => null)
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
    translationFn: resolvedTranslationFn
  }, { recursive: true });
  const ctx = state as SpeakState;
  const { locale, translation, config, translationFn } = ctx;

  useContextProvider(SpeakContext, ctx);

  // Get URL object
  const url = new URL(useEnvData('url') ?? document.location.href);

  // Will block the rendering until callback resolves
  useMount$(async () => {
    // Resolve the locale
    const resolvedLocale = props.locale ?? config.defaultLocale;

    const resolvedLangs = new Set(props.langs || []);
    resolvedLangs.add(resolvedLocale.lang);

    // Load translation data
    for (const lang of resolvedLangs) {
      const loadedTranslation = await loadTranslation(lang, ctx, url.origin);
      Object.assign(translation, loadedTranslation);
    }

    Object.assign(locale, resolvedLocale);

    // Prevent Qwik from creating subscriptions
    if (isServer) {
      // Shallow freeze: only applies to the immediate properties of object itself
      Object.freeze(translation);
      Object.freeze(config);
      Object.freeze(translationFn)
    }
  });

  return <Slot />;
});

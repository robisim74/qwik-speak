import { $, component$, Slot, useContextProvider, useServerData, useStore, useTask$ } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';

import type { InternalSpeakState, SpeakConfig, SpeakLocale, SpeakState, TranslationFn } from './types';
import { SpeakContext } from './context';
import { loadTranslations } from './core';

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
   * Optional additional languages to preload data for (multilingual)
   */
  langs?: string[];
}

/**
 * Create and provide SpeakContext.
 */
export const QwikSpeakProvider = component$((props: QwikSpeakProps) => {
  // Get URL object
  const urlEnv = useServerData<string>('url');
  const url = isServer && urlEnv ? new URL(urlEnv) : null;

  // Get Qwik locale
  const lang = useServerData<string>('locale');

  // Resolve functions
  const resolvedTranslationFn: TranslationFn = {
    loadTranslation$: props.translationFn?.loadTranslation$ ?? $(() => null)
  };

  // Resolve locale
  const resolvedLocale = props.locale ??
    props.config.supportedLocales.find(value => value.lang === lang) ??
    props.config.defaultLocale;

  // Set initial state
  const state = useStore<InternalSpeakState>({
    locale: Object.assign({}, resolvedLocale),
    translation: Object.fromEntries(props.config.supportedLocales.map(value => [value.lang, {}])),
    config: {
      defaultLocale: props.config.defaultLocale,
      supportedLocales: props.config.supportedLocales,
      assets: props.config.assets,
      keySeparator: props.config.keySeparator || '.',
      keyValueSeparator: props.config.keyValueSeparator || '@@'
    },
    translationFn: resolvedTranslationFn
  }, { recursive: true });
  const ctx = state as SpeakState;
  const { locale, translation, config, translationFn } = ctx;

  // Create context
  useContextProvider(SpeakContext, ctx);

  // Called the first time when the component mounts, and when lang changes
  useTask$(async ({ track }) => {
    track(() => locale.lang);

    // Load translations
    await loadTranslations(ctx, url?.origin, props.langs);

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

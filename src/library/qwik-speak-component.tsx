import { $, component$, Slot, useContextProvider, useServerData, useStore, useTask$ } from '@builder.io/qwik';
import { isDev, isServer } from '@builder.io/qwik/build';

import type { SpeakConfig, SpeakLocale, SpeakState, TranslationFn } from './types';
import { SpeakContext } from './context';
import { loadTranslations } from './core';
import { logDebug } from './log';

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

  if (isDev) logDebug(`Resolved locale: ${resolvedLocale.lang}`);

  // Set initial state
  const state = useStore<SpeakState>({
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
  }, { deep: true });
  const { locale, translation, config, translationFn } = state;

  // Create context
  useContextProvider(SpeakContext, state);

  // Called the first time when the component mounts, and when lang changes
  useTask$(async ({ track }) => {
    track(() => locale.lang);

    // Load translations
    await loadTranslations(state, url?.origin, props.langs);

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

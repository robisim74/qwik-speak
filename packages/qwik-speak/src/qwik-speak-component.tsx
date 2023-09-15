import { $, component$, Slot, useContextProvider, useServerData, useTask$ } from '@builder.io/qwik';
import { isDev } from '@builder.io/qwik/build';

import type { SpeakConfig, SpeakLocale, SpeakState, TranslationFn } from './types';
import { SpeakContext } from './context';
import { loadTranslations } from './core';
import { logDebug, logWarn } from './log';

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
 * Create and provide the Speak context
 */
export const QwikSpeakProvider = component$((props: QwikSpeakProps) => {
  // Get Qwik locale
  const lang = useServerData<string>('locale');

  // Resolve functions
  const resolvedTranslationFn: TranslationFn = {
    loadTranslation$: props.translationFn?.loadTranslation$ ?? $(() => null)
  };

  // Resolve locale
  let resolvedLocale = props.locale ?? props.config.supportedLocales.find(value => value.lang === lang);
  if (!resolvedLocale) {
    resolvedLocale = props.config.defaultLocale;

    if (isDev) logWarn(`Locale not resolved. Fallback to default locale: ${props.config.defaultLocale.lang}`);
  } else if (isDev) {
    logDebug(`Resolved locale: ${resolvedLocale.lang}`);
  }

  // Set initial state as object (no reactive)
  const state: SpeakState = {
    locale: Object.assign({}, resolvedLocale),
    translation: Object.fromEntries(props.config.supportedLocales.map(value => [value.lang, {}])),
    config: {
      rewriteRoutes: props.config.rewriteRoutes,
      defaultLocale: props.config.defaultLocale,
      supportedLocales: props.config.supportedLocales,
      assets: props.config.assets,
      runtimeAssets: props.config.runtimeAssets,
      keySeparator: props.config.keySeparator || '.',
      keyValueSeparator: props.config.keyValueSeparator || '@@'
    },
    translationFn: resolvedTranslationFn
  };
  const { config } = state;

  // Create context
  useContextProvider(SpeakContext, state);

  // Called the first time when the component mounts
  useTask$(async () => {
    await loadTranslations(state, config.assets, config.runtimeAssets, props.langs);
  });

  return <Slot />;
});

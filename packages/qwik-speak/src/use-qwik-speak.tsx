import { $, component$, getLocale, Slot, useContextProvider, useOnWindow, useTask$ } from '@builder.io/qwik';
import { isDev, isServer } from '@builder.io/qwik/build';

import type { SpeakConfig, SpeakLocale, SpeakState, TranslationFn } from './types';
import { getSpeakContext, setGetLangFn, SpeakContext } from './context';
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
   * Optional additional languages to preload data for (multilingual)
   */
  langs?: string[];
}

export interface QwikSpeakMockProps extends QwikSpeakProps {
  /**
   * Optional locale to use
   */
  locale?: SpeakLocale;
}

/**
 * Create and provide the Speak context.
 * Translations will be available in the whole app
 */
export const useQwikSpeak = (props: QwikSpeakProps) => {
  // Get Qwik locale
  const lang = getLocale('');

  // Resolve locale
  let resolvedLocale = props.config.supportedLocales.find(value => value.lang === lang);
  if (!resolvedLocale) {
    resolvedLocale = props.config.defaultLocale;

    if (isDev) logWarn(`Locale not resolved. Fallback to default locale: ${props.config.defaultLocale.lang}`);
  } else if (isDev) {
    logDebug(`Resolved locale: ${resolvedLocale.lang}`);
  }

  // Resolve functions
  const resolvedTranslationFn: TranslationFn = {
    loadTranslation$: props.translationFn?.loadTranslation$ ?? $(() => null)
  };

  // Resolve config
  const resolvedConfig: SpeakConfig = {
    rewriteRoutes: props.config.rewriteRoutes,
    defaultLocale: props.config.defaultLocale,
    supportedLocales: props.config.supportedLocales,
    assets: props.config.assets,
    runtimeAssets: props.config.runtimeAssets,
    keySeparator: props.config.keySeparator || '.',
    keyValueSeparator: props.config.keyValueSeparator || '@@'
  };

  // Set initial state as object (no reactive)
  const state: SpeakState = {
    locale: Object.assign({}, resolvedLocale),
    translation: Object.fromEntries(props.config.supportedLocales.map(value => [value.lang, {}])),
    config: Object.assign({}, resolvedConfig),
    translationFn: resolvedTranslationFn
  };

  const { config } = state;

  // Set Qwik Speak server context
  const { config: _config } = getSpeakContext();
  Object.assign(_config, resolvedConfig);

  // Set the getLang function to use Qwik locale
  setGetLangFn(() => getLocale(config.defaultLocale.lang));

  // Create Qwik context
  useContextProvider(SpeakContext, state);

  // Load translations
  useTask$(async () => {
    if (isServer) {
      await loadTranslations(state, config.assets, config.runtimeAssets, props.langs);
    }
  });

  // Resume Qwik Speak context on client
  const resumeContext$ = $(() => {
    const { locale, translation, config } = state;
    // Set Qwik Speak client context
    const _speakContext = getSpeakContext();
    const { locale: _locale, translation: _translation, config: _config } = _speakContext;
    Object.assign(_locale, locale);
    Object.assign(_translation, translation);
    Object.assign(_config, config);

    // Set the getLang function to use the current lang
    setGetLangFn(() => locale.lang);

    if (isDev) {
      console.debug(
        '%cQwik Speak Inline',
        'background: #0c75d2; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;',
        'Client context',
        _speakContext
      );
    }

    // In dev mode, send lang from client to the server
    if (isDev) {
      console.debug(
        '%cQwik Speak Inline',
        'background: #0c75d2; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;',
        'Ready'
      );
      if (import.meta.hot) {
        import.meta.hot.send('qwik-speak:lang', { msg: locale.lang });
      }
    }
  });

  // The load event is fired when the whole page has loaded
  useOnWindow('load', resumeContext$);
};

/**
 * Create and provide the Speak context to test enviroments
 */
export const QwikSpeakMockProvider = component$<QwikSpeakMockProps>(props => {
  const lang = props.locale?.lang;

  // Resolve locale
  let resolvedLocale = props.config.supportedLocales.find(value => value.lang === lang);
  if (!resolvedLocale) {
    resolvedLocale = props.config.defaultLocale;
  }

  // Resolve functions
  const resolvedTranslationFn: TranslationFn = {
    loadTranslation$: props.translationFn?.loadTranslation$ ?? $(() => null)
  };

  // Resolve config
  const resolvedConfig: SpeakConfig = {
    rewriteRoutes: props.config.rewriteRoutes,
    defaultLocale: props.config.defaultLocale,
    supportedLocales: props.config.supportedLocales,
    assets: props.config.assets,
    runtimeAssets: props.config.runtimeAssets,
    keySeparator: props.config.keySeparator || '.',
    keyValueSeparator: props.config.keyValueSeparator || '@@'
  };

  // Set initial state as object (no reactive)
  const state: SpeakState = {
    locale: Object.assign({}, resolvedLocale),
    translation: Object.fromEntries(props.config.supportedLocales.map(value => [value.lang, {}])),
    config: Object.assign({}, resolvedConfig),
    translationFn: resolvedTranslationFn
  };

  const { config } = state;

  // Set Qwik Speak server context
  const { config: _config } = getSpeakContext();
  Object.assign(_config, resolvedConfig);

  // Set the getLang function to use the provided lang
  setGetLangFn(() => resolvedLocale!.lang);

  // Create context
  useContextProvider(SpeakContext, state);

  // Load translations
  useTask$(async () => {
    await loadTranslations(state, config.assets, config.runtimeAssets, props.langs);
  });

  return <Slot />;
});

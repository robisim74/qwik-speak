import { component$, Slot, useContextProvider, useMount$, useStore } from '@builder.io/qwik';
import { useEndpoint, useLocation } from '@builder.io/qwik-city';
import { isServer } from '@builder.io/qwik/build';

import type { InternalSpeakState, SpeakConfig, SpeakState, TranslateFn } from './types';
import { getTranslation$, resolveLocale$, setLocale$, handleMissingTranslation$ } from './constants';
import { SpeakContext } from './context';
import { loadTranslation } from './core';
import { speakDev } from './utils';

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
  const resolvedTranslateFn: TranslateFn = {};
  resolvedTranslateFn.getTranslation$ = props.translateFn?.getTranslation$ ?? getTranslation$;
  resolvedTranslateFn.resolveLocale$ = props.translateFn?.resolveLocale$ ?? resolveLocale$;
  resolvedTranslateFn.storeLocale$ = props.translateFn?.storeLocale$ ?? setLocale$;
  resolvedTranslateFn.handleMissingTranslation$ = props.translateFn?.handleMissingTranslation$ ??
    handleMissingTranslation$;

  // Set initial state
  const state = useStore<InternalSpeakState>({
    locale: {},
    translation: Object.fromEntries(props.config.supportedLocales.map(value => [value.lang, {}])),
    config: {
      defaultLocale: props.config.defaultLocale,
      supportedLocales: props.config.supportedLocales,
      assets: [...props.config.assets], // Shallow copy
      keySeparator: props.config.keySeparator
    },
    translateFn: resolvedTranslateFn
  }, { recursive: true });
  const ctx = state as SpeakState;
  const { locale, translation, config, translateFn } = ctx;

  useContextProvider(SpeakContext, ctx);

  // Get location data
  const location = useLocation();
  // Get endopoint data
  const resource = useEndpoint<any>();

  // Will block the rendering until callback resolves
  useMount$(async () => {
    const endpointData = await resource.promise;

    // Resolve the locale
    let resolvedLocale = await translateFn.resolveLocale$(location, endpointData);

    if (!resolvedLocale) {
      resolvedLocale = config.defaultLocale;
    }

    const resolvedLangs = new Set(props.langs || []);
    resolvedLangs.add(resolvedLocale.lang);

    // Load translation data
    for (const lang of resolvedLangs) {
      const loadedTranslation = await loadTranslation(lang, ctx, location);
      Object.assign(translation, loadedTranslation);

      if (speakDev) {
        console.debug('Qwik Speak', '', `Translation loaded - ${config.assets} - ${lang}`);
      }
    }

    Object.assign(locale, resolvedLocale);

    // Prevent Qwik from creating subscriptions
    if (isServer) {
      // Shallow freeze: only applies to the immediate properties of object itself
      Object.freeze(translation);
      Object.freeze(config);
      Object.freeze(translateFn)
    }
  });

  return <Slot />;
});

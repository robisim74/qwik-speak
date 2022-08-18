import { component$, Slot, useContextProvider, useMount$, useStore } from '@builder.io/qwik';
import { useEndpoint, useLocation } from '@builder.io/qwik-city';
import { isServer } from '@builder.io/qwik/build';

import type { InternalSpeakState, SpeakConfig, SpeakState, TranslateFn } from './types';
import { getTranslation$, resolveLocale$, setLocale$, handleMissingTranslation$ } from './constants';
import { SpeakContext } from './context';
import { loadTranslation } from './core';
import { qDev } from './utils';

export interface QwikSpeakProps {
  config: SpeakConfig;
  translateFn?: TranslateFn;
  langs?: string[];
}

export const QwikSpeak = component$((props: QwikSpeakProps) => {
  // Assign functions
  const translateFn: TranslateFn = {};
  translateFn.getTranslation$ = props.translateFn?.getTranslation$ ?? getTranslation$;
  translateFn.resolveLocale$ = props.translateFn?.resolveLocale$ ?? resolveLocale$;
  translateFn.storeLocale$ = props.translateFn?.storeLocale$ ?? setLocale$;
  translateFn.handleMissingTranslation$ = props.translateFn?.handleMissingTranslation$ ?? handleMissingTranslation$;

  // Set initial state
  const state = useStore<InternalSpeakState>({
    locale: {},
    translation: Object.fromEntries(props.config.supportedLocales.map(value => [value.lang, {}])),
    config: props.config,
    translateFn: translateFn
  }, { recursive: true });
  const ctx = state as SpeakState;
  const { locale, translation } = ctx;

  useContextProvider(SpeakContext, ctx);

  // Get location data
  const location = useLocation();
  // Get endopoint data
  const resource = useEndpoint<any>();

  // Will block the rendering until callback resolves
  useMount$(async () => {
    const endpointData = await resource.promise;

    // Resolve the locale
    let resolvedLocale = await ctx.translateFn.resolveLocale$(location, endpointData);

    if (!resolvedLocale) {
      resolvedLocale = props.config.defaultLocale;
    }

    const resolvedLangs = new Set(props.langs || []);
    resolvedLangs.add(resolvedLocale.lang);

    // Load translation data
    for (const lang of resolvedLangs) {
      const loadedTranslation = await loadTranslation(lang, ctx, location);
      Object.assign(translation, loadedTranslation);
    }

    Object.assign(locale, resolvedLocale);

    // Prevent Qwik from creating subscriptions
    if (isServer) {
      // Shallow freeze: only applies to the immediate properties of object itself
      Object.freeze(translation);
      Object.freeze(props.config);
      Object.freeze(translateFn)
    }

    if (qDev) {
      console.debug('Qwik Speak', '', 'Translation loaded');
    }
  });

  return <Slot />;
});

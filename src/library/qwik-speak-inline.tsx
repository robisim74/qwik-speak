import { component$, useClientEffect$ } from '@builder.io/qwik';

import { useSpeakLocale } from './use-functions';

/**
 * Set global $lang on client for inlining 
 * https://github.com/BuilderIO/qwik/issues/1413
 */
export const QwikSpeakInline = component$(() => {
  const locale = useSpeakLocale();

  useClientEffect$(({ track }) => {
    const lang = track(() => locale.lang);

    globalThis.$lang = lang;
  }, { eagerness: 'load' });

  return <qwik-speak-inline></qwik-speak-inline>;
});

import { component$, Slot, useVisibleTask$ } from '@builder.io/qwik';
import { isDev } from '@builder.io/qwik/build';

import { useSpeakContext } from './use-functions';
import { _speakContext, } from './context';

export const QwikSpeakInline = component$(() => {
  const ctx = useSpeakContext();

  useVisibleTask$(() => {
    const { locale, translation, config } = ctx;

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

    // Create client context
    _speakContext.locale = locale;
    _speakContext.translation = translation;
    _speakContext.config = config;

    if (isDev) {
      console.debug(
        '%cQwik Speak Inline',
        'background: #0c75d2; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;',
        'Client context',
        _speakContext
      );
    }
  }, { strategy: 'document-ready' });

  return <Slot />;
});

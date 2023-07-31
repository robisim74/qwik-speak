import { component$, Slot, useVisibleTask$ } from '@builder.io/qwik';
import { isDev } from '@builder.io/qwik/build';

import { useSpeakLocale } from './use-speak';

/**
 * Create and provide Qwik Speak inline in dev mode
 */
export const QwikSpeakInline = component$(() => {
  const locale = useSpeakLocale();

  // In dev mode, send lang from client to the server
  useVisibleTask$(() => {
    if (isDev) {
      console.debug(
        '%cQwik Speak Inline',
        'background: #0c75d2; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;',
        'ready'
      );
      if (import.meta.hot) {
        import.meta.hot.send('qwik-speak:lang', { msg: locale.lang });
      }
    }
  }, { strategy: 'document-ready' });

  return <Slot />;
});

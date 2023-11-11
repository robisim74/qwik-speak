import { useVisibleTask$ } from '@builder.io/qwik';

import { useSpeakLocale } from './use-speak';

export const useInline = () => {
  const locale = useSpeakLocale();

  // In dev mode, send lang from client to the server
  useVisibleTask$(() => {
    console.debug(
      '%cQwik Speak Inline',
      'background: #0c75d2; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;',
      'ready'
    );
    if (import.meta.hot) {
      import.meta.hot.send('qwik-speak:lang', { msg: locale.lang });
    }
  }, { strategy: 'document-ready' });
};

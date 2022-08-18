import { component$ } from '@builder.io/qwik';
import { QwikCity, RouterOutlet } from '@builder.io/qwik-city';
import { QwikSpeak } from './library/qwik-speak';

import { Head } from './app/components/head/head';
import { config, translateFn } from './app/speak-config';

import './global.css';

export default component$(() => {
  return (
    <QwikCity>
      {/* Init Qwik Speak (only available in child components) */}
      <QwikSpeak config={config} translateFn={translateFn}>
        <Head />
        <body>
          <RouterOutlet />
        </body>
      </QwikSpeak>
    </QwikCity>
  );
});

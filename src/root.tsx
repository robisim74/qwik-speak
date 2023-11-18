import { component$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { useQwikSpeak } from 'qwik-speak';

import { RouterHead } from './components/router-head/router-head';
import { config } from './speak-config';
import { translationFn } from './speak-functions';

import './global.css';

export default component$(() => {
  /**
   * Init Qwik Speak
   */
  useQwikSpeak({ config, translationFn });

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <ServiceWorkerRegister />
      </head>
      <body>
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});

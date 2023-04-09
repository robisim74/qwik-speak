import { component$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { QwikSpeakProvider } from 'qwik-speak';

import { RouterHead } from './components/router-head/router-head';
import { config } from './speak-config';
import { translationFn } from './speak-functions';

import './global.css';

export default component$(() => {
  return (
    /**
     * Init Qwik Speak (only available in child components)
     */
    <QwikSpeakProvider config={config} translationFn={translationFn}>
      <QwikCityProvider>
        <head>
          <meta charSet="utf-8" />
          <link rel="manifest" href="/manifest.json" />
          <RouterHead />
        </head>
        <body>
          <RouterOutlet />
          <ServiceWorkerRegister />
        </body>
      </QwikCityProvider>
    </QwikSpeakProvider>
  );
});

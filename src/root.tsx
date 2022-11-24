import { component$, useStyles$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { QwikSpeak } from 'qwik-speak';

import { RouterHead } from './app/components/router-head/router-head';
import { config, translateFn } from './app/speak-config';

import globalStyles from './global.css?inline';

export default component$(() => {
  useStyles$(globalStyles);

  return (
    /**
     * Init Qwik Speak (only available in child components)
     */
    <QwikSpeak config={config} translateFn={translateFn}>
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
    </QwikSpeak>
  );
});

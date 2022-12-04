import { component$, getLocale, useStyles$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { QwikSpeak } from 'qwik-speak';

import { RouterHead } from './app/components/router-head/router-head';
import { config, translationFn } from './app/speak-config';

import globalStyles from './global.css?inline';

export default component$(() => {
  useStyles$(globalStyles);

  const lang = getLocale();
  const locale = config.supportedLocales.find(x => x.lang === lang);

  return (
    /**
     * Init Qwik Speak (only available in child components)
     */
    <QwikSpeak config={config} translationFn={translationFn} locale={locale}>
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

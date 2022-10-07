import { component$ } from '@builder.io/qwik';
import { QwikCity, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { QwikSpeak, QwikSpeakInline } from 'qwik-speak';

import { RouterHead } from './app/components/router-head/router-head';
import { config, translateFn } from './app/speak-config';

import './global.css';

export default component$(() => {
  return (
    /**
     * Init Qwik Speak (only available in child components)
     */
    <QwikSpeak config={config} translateFn={translateFn}>
      <QwikCity>
        <head>
          <meta charSet="utf-8" />
          <RouterHead />
        </head>
        <body>
          <RouterOutlet />
          <ServiceWorkerRegister />
          <QwikSpeakInline />
        </body>
      </QwikCity>
    </QwikSpeak>
  );
});

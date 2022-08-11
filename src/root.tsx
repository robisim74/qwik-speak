import { component$ } from '@builder.io/qwik';
import { QwikCity, RouterOutlet } from '@builder.io/qwik-city';
import { Head } from './app/components/head/head';

import './global.css';

export default component$(() => {
  return (
    <QwikCity>
      <Head />
      <body>
        <RouterOutlet />
      </body>
    </QwikCity>
  );
});

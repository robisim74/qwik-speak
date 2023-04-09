import { component$, Slot } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';

import { Header } from '../components/header/header';
import { config } from '../speak-config';

export default component$(() => {
  return (
    <main>
      <Header />
      <Slot />
    </main>
  );
});

export const onRequest: RequestHandler = ({ params, locale }) => {
  const lang = params.lang;

  // Set Qwik locale
  locale(lang || config.defaultLocale.lang);
};

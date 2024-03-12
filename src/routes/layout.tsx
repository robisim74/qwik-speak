import { component$, Slot } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';

import { Header } from '../components/header/header';
// import { localizePath } from '../../packages/qwik-speak/src/routing';
// import { config } from '../speak-config';

export default component$(() => {
  return (
    <main>
      <Header />
      <Slot />
    </main>
  );
});

export const onRequest: RequestHandler = ({ locale, error }) => {
  // E.g. 404 error page
  if (!locale()) throw error(404, 'Page not found for requested locale');

  // E.g. Redirect
  // if (!locale()) {
  //   const getPath = localizePath();
  //   throw redirect(302, getPath('/page', 'en-US')); // Let the server know the language to use
  // }
};

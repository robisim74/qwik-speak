import { component$, Slot } from '@builder.io/qwik';
import { RequestHandler } from '@builder.io/qwik-city';

import { Header } from '../components/header/header';

export default component$(() => {
  return (
    <div>
      <Header />
      <main>
        <Slot />
      </main>
    </div>
  );
});

// E.g. Add cookie & accept-language to endpoint response
export const onGet: RequestHandler = ({ request }) => {
  const cookie = request.headers?.get('cookie');
  const acceptLanguage = request.headers?.get('accept-language');

  return {
    headers: {
      cookie: cookie,
      acceptLanguage: acceptLanguage
    }
  };
};

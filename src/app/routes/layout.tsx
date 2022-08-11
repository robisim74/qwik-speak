import { component$, Slot } from '@builder.io/qwik';
import { RequestHandler } from '@builder.io/qwik-city';
import { useSpeak } from '../../library/use-speak';

import { Header } from '../components/header/header';
import { getConfig, getTranslateFn } from '../speak-config';

export default component$(() => {
  /**
   * Init Speak (only available in child components)
   */
  useSpeak(getConfig(), getTranslateFn());

  return (
    <>
      <Header />
      <main>
        <Slot />
      </main>
    </>
  );
});

// E.g. add cookie & accept language to endpoint response
/* export const onGet: RequestHandler = ({ request }) => {
  const cookie = request.headers?.get('cookie');
  const acceptLanguage = request.headers?.get('accept-language');

  return {
    status: 200,
    headers: {
      cookie: cookie,
      acceptLanguage: acceptLanguage
    }
  };
}; */

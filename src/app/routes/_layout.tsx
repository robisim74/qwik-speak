import { component$, Host, Slot } from '@builder.io/qwik';
import { EndpointHandler } from '@builder.io/qwik-city';
import { useSpeak } from '../../library/use-speak';

import { Header } from '../components/header/header';
import { getConfig, getTranslateFn } from '../speak-config';

export default component$(() => {
  /**
   * Init Speak
   */
  useSpeak(getConfig(), getTranslateFn());

  return (
    <Host>
      <Header />
      <main>
        <Slot />
      </main>
    </Host >
  );
});

// E.g. add cookie & accept language to endpoint response
/* export const onGet: EndpointHandler = ({ request }) => {
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

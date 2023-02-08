import { component$, Slot } from '@builder.io/qwik';
import { RequestHandler } from '@builder.io/qwik-city';

import { Header } from '../components/header/header';
import { config } from '../speak-config';

export default component$(() => {
  return (
    <>
      <Header />
      <main>
        <Slot />
      </main>
    </>
  );
});

export const onRequest: RequestHandler = ({ request, response, params }) => {
  let lang = params.lang?.replace(/^\/|\/$/g, '');

  // Set locale in response
  response.locale = lang || config.defaultLocale.lang;

  // E.g. Redirect if the language is different from the default language
  if (!lang) {
    const cookie = request.headers?.get('cookie');
    const acceptLanguage = request.headers?.get('accept-language');

    // Try whether the language is stored in a cookie
    if (cookie) {
      const result = new RegExp('(?:^|; )' + encodeURIComponent('locale') + '=([^;]*)').exec(cookie);
      if (result) {
        lang = JSON.parse(result[1])['lang'];
      }
    }
    // Try to use user language
    if (!lang) {
      if (acceptLanguage) {
        lang = acceptLanguage.split(';')[0]?.split(',')[0];
      }
    }

    if (lang !== config.defaultLocale.lang) {
      if (config.supportedLocales.find(x => x.lang === lang)) {
        const url = new URL(request.url);
        throw response.redirect(`/${lang}${url.pathname}`, 302);
      }
    }
  }
};

import type { RequestHandler } from "@builder.io/qwik-city";
import { validateLocale } from 'qwik-speak';

import { config } from '../speak-config';
// import { rewriteRoutes } from '../speak-routes';

export const onRequest: RequestHandler = ({ params, locale, error }) => {
  let lang: string | undefined = undefined;

  if (params.lang && validateLocale(params.lang)) {
    // Check supported locales
    lang = config.supportedLocales.find(value => value.lang === params.lang)?.lang;
    // 404 error page
    if (!lang) throw error(404, 'Page not found');
  } else {
    lang = config.defaultLocale.lang;
  }

  // Set Qwik locale
  locale(lang);
};

/**
 * Uncomment this lines to use url rewriting to translate paths.
 * Remove [..lang] from folders structure
 */
// export const onRequest: RequestHandler = ({ url, locale }) => {
//   const parts = url.pathname.split('/')
//   const prefix = url.pathname.startsWith('/') ? parts[1] : parts[0]

//   const lang = rewriteRoutes.find(
//     rewrite => rewrite.prefix === prefix
//   )?.prefix

//   // Set Qwik locale
//   locale(lang || config.defaultLocale.lang);
// };
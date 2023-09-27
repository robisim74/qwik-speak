import type { RequestHandler } from "@builder.io/qwik-city";

import { config } from '../speak-config';
// import { rewriteRoutes } from '../speak-routes';

export const onRequest: RequestHandler = ({ params, locale, error }) => {
  // Check supported locales
  const supportedLocale = config.supportedLocales.find(value => value.lang === params.lang)

  // Check for 404 error page
  const lang = supportedLocale
    ? supportedLocale.lang
    : !params.lang && config.defaultLocale.lang

  if (!lang) throw error(404, 'Page not found');

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
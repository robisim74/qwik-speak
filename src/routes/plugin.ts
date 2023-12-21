import type { RequestHandler } from '@builder.io/qwik-city';
import { validateLocale } from 'qwik-speak';

import { config } from '../speak-config';
//import { rewriteRoutes } from '../speak-routes';

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
// export const onRequest: RequestHandler = ({ locale, error, url }) => {
//   let lang: string | undefined = undefined;

//   const prefix = extractFromUrl(url);

//   if (prefix && validateLocale(prefix)) {
//     // Check supported locales
//     lang = config.supportedLocales.find(value => value.lang === prefix)?.lang;
//     // 404 error page
//     if (!lang) throw error(404, 'Page not found');
//   } else {
//     lang = config.defaultLocale.lang;
//   }

//   // Set Qwik locale
//   locale(lang);
// };

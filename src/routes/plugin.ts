import type { RequestHandler } from "@builder.io/qwik-city";

import { config } from '../speak-config';
// import {rewriteRoutes} from "~/speak-routes";

export const onRequest: RequestHandler = ({ params, locale }) => {
  // Check supported locales
  const lang = config.supportedLocales.find(value => value.lang === params.lang)?.lang || config.defaultLocale.lang;

  // Set Qwik locale
  locale(lang);
};

// export const onRequest: RequestHandler = ({ url, locale }) => {
//     const parts = url.pathname.split('/')
//     const prefix = url.pathname.startsWith('/') ? parts[1] : parts[0]
//
//     const lang = rewriteRoutes.find(
//         rewrite => rewrite.prefix === prefix
//     )?.prefix
//
//     // Set Qwik locale
//     locale(lang || config.defaultLocale.lang);
// };
import type { RequestHandler } from "@builder.io/qwik-city";

import { config } from '../speak-config';

export const onRequest: RequestHandler = ({ params, locale }) => {
  // Check supported locales
  const lang = config.supportedLocales.find(value => value.lang === params.lang)?.lang || config.defaultLocale.lang;

  // Set Qwik locale
  locale(lang);
};

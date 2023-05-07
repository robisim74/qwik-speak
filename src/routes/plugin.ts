import type { RequestHandler } from "@builder.io/qwik-city";

import { config } from '../speak-config';

export const onRequest: RequestHandler = ({ params, locale }) => {
    const lang = params.lang;

    // Set Qwik locale
    locale(lang || config.defaultLocale.lang);
};

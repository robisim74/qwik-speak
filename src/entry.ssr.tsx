/**
 * WHAT IS THIS FILE?
 *
 * SSR entry point, in all cases the application is render outside the browser, this
 * entry point will be the common one.
 *
 * - Server (express, cloudflare...)
 * - npm run start
 * - npm run preview
 * - npm run build
 *
 */
import { isDev } from '@builder.io/qwik/build';
import type { RenderOptions, RenderToStreamOptions } from '@builder.io/qwik/server';
import { renderToStream } from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import Root from './root';

import { config } from './speak-config';

/**
 * Determine the base URL to use for loading the chunks in the browser.
 * The value set through Qwik 'locale()' in 'plugin.ts' is saved by Qwik in 'serverData.locale' directly.
 * Make sure the locale is among the 'supportedLocales'
 */
export function extractBase({ serverData }: RenderOptions): string {
  if (!isDev && serverData?.locale) {
    return '/build/' + serverData.locale;
  } else {
    return '/build';
  }
}

export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    manifest,
    ...opts,
    // Determine the base URL for the client code
    base: extractBase,
    // Use container attributes to set attributes on the html tag
    containerAttributes: {
      lang: opts.serverData?.locale || config.defaultLocale.lang,
      dir: config.supportedLocales.find(x => x.lang === opts.serverData?.locale)?.dir || config.defaultLocale.dir || 'auto',
      ...opts.containerAttributes,
    }
  });
}

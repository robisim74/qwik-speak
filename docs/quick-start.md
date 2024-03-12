# Quick Start

> Setup an app with Qwik Speak

```shell       
npm install qwik-speak --save-dev
```

## Vite plugin
Add [Qwik Speak Inline Vite plugin](./inline.md) in `vite.config.ts`:
```typescript
import { qwikSpeakInline } from 'qwik-speak/inline';

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity(),
      qwikVite(),
      qwikSpeakInline({
        supportedLangs: ['en-US', 'it-IT'],
        defaultLang: 'en-US',
        assetsPath: 'i18n'
      }),
      tsconfigPaths(),
    ],
  };
});
```

## Configuration
Let's create `speak-config.ts` and `speak-functions.ts` files in `src` folder:

_src/speak-config.ts_
```typescript
import type { SpeakConfig } from 'qwik-speak';

export const config: SpeakConfig = {
  defaultLocale: { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles' },
  supportedLocales: [
    { lang: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome' },
    { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles' }
  ],
  // Translations available in the whole app
  assets: [
    'app'
  ],
  // Translations with dynamic keys available in the whole app
  runtimeAssets: [
    'runtime'
  ]
};
```
_src/speak-functions.ts_
```typescript
import { server$ } from '@builder.io/qwik-city';
import type { LoadTranslationFn, Translation, TranslationFn } from 'qwik-speak';

/**
 * Translation files are lazy-loaded via dynamic import and will be split into separate chunks during build.
 * Assets names and keys must be valid variable names
 */
const translationData = import.meta.glob<Translation>('/i18n/**/*.json');

/**
 * Using server$, translation data is always accessed on the server
 */
const loadTranslation$: LoadTranslationFn = server$(async (lang: string, asset: string) =>
  await translationData[`/i18n/${lang}/${asset}.json`]?.()
);

export const translationFn: TranslationFn = {
  loadTranslation$: loadTranslation$
};
```
> `loadTranslation$` is a customizable QRL function: you can load the translation files in the way you prefer

For more details, see [Translation functions](./translation-functions.md)


Add `useQwikSpeak` provider in `root.tsx` and pass it the configuration and the translation functions:

_src/root.tsx_
```tsx
import { useQwikSpeak } from 'qwik-speak';
import { config } from "./speak-config";
import { translationFn } from "./speak-functions";

export default component$(() => {
  /**
   * Init Qwik Speak
   */
  useQwikSpeak({ config, translationFn });

  return (
    <QwikCityProvider>
      {/* ... */}
    </QwikCityProvider>
  );
});
```

## Resolve locale
Create `plugin.ts` in the root of the `src/routes` directory:

_src/routes/plugin.ts_
```typescript
import type { RequestHandler } from '@builder.io/qwik-city';
import { config } from '../speak-config';

/**
 * This middleware function must only contain the logic to set the locale,
 * because it is invoked on every request to the server.
 * Avoid redirecting or throwing errors here, and prefer layouts or pages
 */
export const onRequest: RequestHandler = ({ request, locale }) => {
  const acceptLanguage = request.headers?.get('accept-language');

  let lang: string | null = null;

  // Try to use user language
  if (acceptLanguage) {
    lang = acceptLanguage.split(';')[0]?.split(',')[0];
  }

  // Check supported locales
  lang = config.supportedLocales.find(value => value.lang === lang)?.lang || config.defaultLocale.lang;

  // Set Qwik locale
  locale(lang);
};
```
> We're on the server here, and you can get the language from `acceptLanguage`, a cookie, or a URL parameter, as you like. But is mandatory to set the Qwik locale

Set the base URL for loading the chunks in the browser in `entry.ssr.tsx` file:
```typescript
import { isDev } from '@builder.io/qwik/build';
import type { RenderOptions } from "@builder.io/qwik/server";
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
      ...opts.containerAttributes,
    },
  });
}
```

## Tutorials
- [Tutorial: localized routing with the language](./tutorial-routing.md)
- [Tutorial: translated routing with url rewriting](./tutorial-routing-rewrite.md)

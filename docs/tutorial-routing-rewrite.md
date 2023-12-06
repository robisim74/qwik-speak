# Tutorial: translated routing with url rewriting

> Step by step, let's build a sample app with Qwik Speak and translated paths using Qwik City features

## Setup
See [Quick Start](./quick-start.md)

## Routing
Let's assume that we want to create a navigation of this type:
- default language (en-US): routes not localized `http://127.0.0.1:4173/`
- other languages (it-IT): localized routes `http://127.0.0.1:4173/it-IT/`

Or:
- default language (en-US): routes not localized `http://127.0.0.1:4173/page`
- other languages (it-IT): localized routes `http://127.0.0.1:4173/it-IT/pagina`

But we DON'T want to have this url instead:
- other languages (it-IT): localized routes `http://127.0.0.1:4173/it-IT/page`

Now let's handle it. Create `speak-routes.ts` file in `src`:

_src/speak-routes.ts_
```typescript
import type { RewriteRouteOption } from 'qwik-speak';

/**
 * Translation paths
 */
export const rewriteRoutes: RewriteRouteOption[] = [
  // No prefix/paths for default locale
  {
    prefix: 'it-IT',
    paths: {
      'page': 'pagina'
    }
  }
];
```
Add `rewriteRoutes` to `qwikCity` Vite plugin in `vite.config.ts`:

```typescript
import { qwikSpeakInline } from 'qwik-speak/inline';

import { rewriteRoutes } from './src/speak-routes';

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity({ rewriteRoutes }), 
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
Add `rewriteRoutes` to `speak-config.ts` in `src`:

_src/speak-config.ts_
```typescript
import type { SpeakConfig } from 'qwik-speak';

import { rewriteRoutes } from './speak-routes';

export const config: SpeakConfig = {
  rewriteRoutes,
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
Update `plugin.ts` in the root of the `src/routes` directory:

_src/routes/plugin.ts_
```typescript
import type { RequestHandler } from "@builder.io/qwik-city";
import { extractFromUrl, validateLocale } from 'qwik-speak';

import { config } from '../speak-config';

export const onRequest: RequestHandler = ({ locale, error, url }) => {
  let lang: string | undefined = undefined;

  const prefix = extractFromUrl(url);

  if (prefix && validateLocale(prefix)) {
    // Check supported locales
    lang = config.supportedLocales.find(value => value.lang === prefix)?.lang;
    // 404 error page
    if (!lang) throw error(404, 'Page not found');
  } else {
    lang = config.defaultLocale.lang;
  }

  // Set Qwik locale
  locale(lang);
};
```

## Usage
Add `index.tsx` with some translation, providing optional default values for each translation: `key@@[default value]`:

_src/routes//index.tsx_
```tsx
import { inlineTranslate, useFormatDate, useFormatNumber } from 'qwik-speak';

export default component$(() => {
  const t = inlineTranslate();

  const fd = useFormatDate();
  const fn = useFormatNumber();

  return (
    <>
      <h1>{t('app.title@@{{name}} demo', { name: 'Qwik Speak' })}</h1>

      <h3>{t('dates@@Dates')}</h3>
      <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p>

      <h3>{t('numbers@@Numbers')}</h3>
      <p>{fn(1000000, { style: 'currency' })}</p>
    </>
  );
});

export const head: DocumentHead = () => {
  const t = inlineTranslate();

  return {
    title: t('app.head.home.title@@{{name}}', { name: 'Qwik Speak' }),
    meta: [{ name: 'description', content: t('app.head.home.description@@Localized routing') }],
  };
};
```
Add a `page/index.tsx` to try the router:

_src/routes//page/index.tsx_
```tsx
import { inlineTranslate } from 'qwik-speak';

export default component$(() => {
  const t = inlineTranslate();

  const key = 'dynamic';

  return (
    <>
      <h1>{t('app.title', { name: 'Qwik Speak' })}</h1>

      <p>{t(`runtime.${key}`)}</p>
    </>
  );
});
```
> Note that it is not necessary to provide the default value in the key once again: it is sufficient and not mandatory to provide it once in the app

> Note the use of a dynamic key (which will therefore only be available at runtime), which we assign to the `runtime` scope

## Change locale
Now we want to change locale. Let's create a `ChangeLocale` component:

_src/components/change-locale/change-locale.tsx_
```tsx
import { useLocation } from '@builder.io/qwik-city';
import { useSpeakLocale, useSpeakConfig, useDisplayName, inlineTranslate, translatePath } from 'qwik-speak';

export const ChangeLocale = component$(() => {
  const t = inlineTranslate();

  const pathname = useLocation().url.pathname;

  const locale = useSpeakLocale();
  const config = useSpeakConfig();
  const dn = useDisplayName();

  const getPath = translatePath();

  return (
    <>
      <h2>{t('app.changeLocale@@Change locale')}</h2>
      {config.supportedLocales.map(value => (
        <a key={value.lang} class={{ active: value.lang == locale.lang }} href={getPath(pathname, value.lang)}>
          {dn(value.lang, { type: 'language' })}
        </a>
      ))}
    </>
  );
});
```
> We use the `<a>` tag tag because it is mandatory to reload the page when changing the language

Add the `ChangeLocale` component in `header.tsx` along with localized navigation links:
```tsx
import { Link, useLocation } from '@builder.io/qwik-city';
import { inlineTranslate, translatePath } from 'qwik-speak';

import { ChangeLocale } from '../../change-locale/change-locale';

export default component$(() => {
  const t = inlineTranslate();

  const pathname = useLocation().url.pathname;

  const getPath = translatePath();
  const [homePath, pagePath] = getPath(['/', '/page/']);

  return (
    <>
      <header>
        <ul>
          <li>
            <Link href={homePath} class={{ active: pathname === homePath }}>
              {t('app.nav.home@@Home')}
            </Link>
          </li>
          <li>
            <Link href={pagePath} class={{ active: pathname === pagePath }}>
              {t('app.nav.page@@Page')}
            </Link>
          </li>
        </ul>
      </header>

      <ChangeLocale />
    </>
  );
});
```

## Extraction
We can now extract the translations and generate the `assets` as json. In `package.json` add the following command to the scripts:
```json
"qwik-speak-extract": "qwik-speak-extract --supportedLangs=en-US,it-IT --assetsPath=i18n"
```

```shell
npm run qwik-speak-extract
```

The following files are generated:
```
i18n/en-US/app.json
i18n/it-IT/app.json
translations skipped due to dynamic keys: 1
extracted keys: 9
```
`app` asset for each language, initialized with the default values we provided.

_translations skipped due to dynamic keys_ is `runtime.${key}`. During configuration, we provided in `runtimeAssets` a `runtime` file, which we can now create and populate with dynamic keys:

_i18n/[lang]/runtime.json_
```json
{
  "runtime": {
    "dynamic": "I'm a dynamic value"
  }
}
```
See [Qwik Speak Extract](./extract.md) for more details.

## Development
We can translate the `it-IT` files and start the app:

```shell
npm start
```

## Production
Build the production app in preview mode:
```shell
npm run preview
```

and inspect the `qwik-speak-inline.log` file in root folder to see warnings for missing values or dynamic keys.

### Domain-based routing
#### Prefix always
If you want to use different domains in production, set the `prefix` usage strategy in `speak-config.ts`:
```typescript
import { rewriteRoutes } from './speak-routes';

export const config: SpeakConfig = {
  rewriteRoutes,
  defaultLocale: { lang: 'en' },
  supportedLocales: [
    { lang: 'en' },
    { lang: 'it' },
    { lang: 'de' }
  ],
  domainBasedRouting: {
    prefix: 'always'
  },
};
```
Update `speak-routes.ts` with the domains supported by each locale:

_src/speak-routes.ts_
```typescript
import type { RewriteRouteOption } from 'qwik-speak';

/**
 * Translation paths
 */
export const rewriteRoutes: RewriteRouteOption[] = [
  // No prefix/paths for default locale
  {
    lang: 'en',
    domain: 'example.com',
    paths: {}
  },
  {
    prefix: 'it',
    domain: 'example.it',
    paths: {
      'page': 'pagina'
    }
  },
  {
    prefix: 'de',
    withDomain: 'example.com',
    paths: {
      'page': 'seite'
    }
  }
];
```

While in dev mode the navigation will only use the prefix, in production it will use the domain and the prefix:
```
https://example.com/
https://example.com/page
https://example.it/it
https://example.it/it/pagina
https://example.com/de
https://example.com/de/seite
```

> In SSG mode, you can only use `always` as prefix strategy

#### Prefix as needed
If in production you don't want the prefix for the default domains, change the prefix strategy to `as-needed` and invoke `toPrefixAsNeeded` for `rewriteRoutes`:
```typescript
import { toPrefixAsNeeded } from 'qwik-speak';
import { rewriteRoutes } from './speak-routes';

export const config: SpeakConfig = {
  rewriteRoutes: toPrefixAsNeeded(rewriteRoutes),
  defaultLocale: { lang: 'en' },
  supportedLocales: [
    { lang: 'en' },
    { lang: 'it' },
    { lang: 'de' }
  ],
  domainBasedRouting: {
    prefix: 'as-needed'
  },
};
```
Also invoke `toPrefixAsNeeded` for `rewriteRoutes` of `qwikCity` Vite plugin in `vite.config.ts` in the following way:

```typescript
import { qwikSpeakInline, toPrefixAsNeeded } from 'qwik-speak/inline';

import { rewriteRoutes } from './src/speak-routes';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      qwikCity({ rewriteRoutes: toPrefixAsNeeded(rewriteRoutes, mode) }), 
      /*  */
    ],
  };
});
```
It will result in:
```
https://example.com/
https://example.com/page
https://example.it
https://example.it/pagina
https://example.com/de
https://example.com/de/seite
```

Since the `de` language does not have a default domain, but we have associated another domain, it will automatically keep the prefix.

#### Usage
Update `plugin.ts` to get the language from the domain:
```typescript
import type { RequestHandler } from '@builder.io/qwik-city';
import { extractFromDomain, extractFromUrl, validateLocale } from 'qwik-speak';

import { config } from '../speak-config';
import { rewriteRoutes } from '../speak-routes';

export const onRequest: RequestHandler = ({ locale, error, url }) => {
  let lang: string | undefined = undefined;

  const prefix = extractFromUrl(url);

  if (prefix && validateLocale(prefix)) {
    // Check supported locales
    lang = config.supportedLocales.find(value => value.lang === prefix)?.lang;
    // 404 error page
    if (!lang) throw error(404, 'Page not found');
  } else {
    // Extract from domain
    lang = extractFromDomain(url, rewriteRoutes) || config.defaultLocale.lang;
  }

  // Set Qwik locale
  locale(lang);
};
```
and in `ChangeLocale` component pass the URL instead of the pathname to `getPath`:
```tsx
export const ChangeLocale = component$(() => {
  const url = useLocation().url;

  const config = useSpeakConfig();

  const getPath = translatePath();

  return (
    <>
      {config.supportedLocales.map(value => (
        <a key={value.lang} href={getPath(url, value.lang)}>
          {/*  */}
        </a>
      ))}
    </>
  );
});
```

# Tutorial: localized routing with the language

> Step by step, let's build a sample app with Qwik Speak and a localized router using Qwik City features

## Setup
See [Quick Start](./quick-start.md)

## Routing
Let's assume that we want to create a navigation of this type:
- default language (en-US): routes not localized `http://127.0.0.1:4173/`
- other languages (it-IT): localized routes `http://127.0.0.1:4173/it-IT/`

In `routes` root level add `[...lang]` directory to catch all routes:
```
src/routes/
│   
└───[...lang]/
        index.tsx
    layout.tsx
```

Now let's handle it. Update `plugin.ts` in the root of the `src/routes` directory:

_src/routes/plugin.ts_
```typescript
import type { RequestHandler } from '@builder.io/qwik-city';
import { validateLocale } from 'qwik-speak';

import { config } from '../speak-config';

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
```

## Usage
Add `index.tsx` with some translation, providing optional default values for each translation: `key@@[default value]`:

_src/routes/[...lang]/index.tsx_
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

_src/routes/[...lang]/page/index.tsx_
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
import { useSpeakLocale, useSpeakConfig, useDisplayName, inlineTranslate, localizePath } from 'qwik-speak';

export const ChangeLocale = component$(() => {
  const t = inlineTranslate();

  const pathname = useLocation().url.pathname;

  const locale = useSpeakLocale();
  const config = useSpeakConfig();
  const dn = useDisplayName();

  const getPath = localizePath();

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
import { inlineTranslate, localizePath } from 'qwik-speak';

import { ChangeLocale } from '../../change-locale/change-locale';

export default component$(() => {
  const t = inlineTranslate();

  const pathname = useLocation().url.pathname;

  const getPath = localizePath();
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

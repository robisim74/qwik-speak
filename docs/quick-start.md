# Quick Start

> Requires Qwik city 0.2.*

```shell
npm create qwik@latest
npm install qwik-speak --save-dev
```

## Configuration
Let's create a `speak-config.ts` file in `src`:

_src/speak-config.ts_
```typescript
import { $ } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import type {
  LoadTranslationFn,
  SpeakConfig,
  TranslationFn
} from 'qwik-speak';

export const config: SpeakConfig = {
  defaultLocale: { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles' },
  supportedLocales: [
    { lang: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome' },
    { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles' }
  ],
  assets: [
    'app'
  ]
};

export const loadTranslation$: LoadTranslationFn = $(async (lang: string, asset: string, origin?: string) => {
  let url = '';
  // Absolute urls on server
  if (isServer && origin) {
    url = origin;
  }
  url += `/i18n/${lang}/${asset}.json`;
  const response = await fetch(url);
  return response.json();
});

export const translationFn: TranslationFn = {
  loadTranslation$: loadTranslation$
};
```
We have added the Speak config and the implementation of the `loadTranslation$` function.

> The `defaultLocale` and `supportedLocales` are required because the library uses the default locale if a locale is set at runtime that is not supported.

Loading of translations can take place both on server and on client (in case of SPA or language change) and the `loadTranslation$` function must support both.

We can also catch exceptions:
```typescript
export const loadTranslation$: LoadTranslationFn = $(async (lang: string, asset: string, origin?: string) => {
  let url = '';
  // Absolute urls on server
  if (isServer && origin) {
    url = origin;
  }
  url += `/i18n/${lang}/${asset}.json`;

  let data: any = null;
  try {
    const response = await fetch(url);
    data = await response.json();
  } catch (error) {
    // Implement error handling here
    console.log('loadTranslation$ error: ', error);
  }
  return data;
});
```

## Adding Qwik Speak
Just wrap Qwik City provider with `QwikSpeakProvider` component in `root.tsx` and pass it the configuration and the translation functions:

_src/root.tsx_
```jsx
import { QwikSpeakProvider } from 'qwik-speak';

export default component$(() => {
  return (
    <QwikSpeakProvider config={config} translationFn={translationFn}>
      <QwikCityProvider>
        <head>
          <meta charSet="utf-8" />
          <link rel="manifest" href="/manifest.json" />
          <RouterHead />
        </head>
        <body lang="en">
          <RouterOutlet />
          <ServiceWorkerRegister />
        </body>
      </QwikCityProvider>
    </QwikSpeakProvider>
  );
});
```

Finally we add an `index.tsx` with some translation:

_src/routes/index.tsx_
```jsx
import {
  $translate as t,
  formatDate as fd,
  formatNumber as fn,
  Speak,
} from 'qwik-speak';

export const Home = component$(() => {
  return (
    <>
      <h1>{t('app.title@@{{name}} demo', { name: 'Qwik Speak' })}</h1>

      <h3>{t('home.dates@@Dates')}</h3>
      <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p>

      <h3>{t('home.numbers@@Numbers')}</h3>
      <p>{fn(1000000, { style: 'currency' })}</p>
    </>
  );
});

export default component$(() => {
  return (
    <Speak assets={['home']}>
      <Home />
    </Speak>
  );
});
```
Here we have used the `Speak` component to add scoped translations to the home page. This means that in addition to the `app` asset that comes with the configuration, the home page will also use the `home` asset. To distinguish them, `app` asset keys start with `app` and home asset keys start with `home`.

We are also providing default values for each translation: `key@@[default value]`.

## Resolve locale
We can resolve the locale to use in two ways: passing the `locale` parameter to the `QwikSpeakProvider` component, or assigning it to the `locale` handled by Qwik. In `layout.tsx`, after the default `component$`, we add:

_src/routes/layout.tsx_
```typescript
export const onRequest: RequestHandler = ({ request, locale }) => {
  const cookie = request.headers?.get('cookie');
  const acceptLanguage = request.headers?.get('accept-language');

  let lang: string | null = null;
  // Try whether the language is stored in a cookie
  if (cookie) {
    const result = new RegExp('(?:^|; )' + encodeURIComponent('locale') + '=([^;]*)').exec(cookie);
    if (result) {
      lang = JSON.parse(result[1])['lang'];
    }
  }
  // Try to use user language
  if (!lang) {
    if (acceptLanguage) {
      lang = acceptLanguage.split(';')[0]?.split(',')[0];
    }
  }

  // Set Qwik locale
  locale(lang || config.defaultLocale.lang);
};
```
Internally, Qwik Speak will try to take the Qwik `locale`, before falling back to default locale if it is not in `supportedLocales`.

## Change locale
Now we want to change locale without reloading the page, just rerendering components that use translations. Let's create a `ChangeLocale` component:

_src/components/header/change-locale.tsx_
```jsx
import { changeLocale, $translate as t, useSpeakContext, useSpeakConfig } from 'qwik-speak';

export const ChangeLocale = component$(() => {
  const ctx = useSpeakContext();
  const config = useSpeakConfig();

  const changeLocale$ = $(async (newLocale: SpeakLocale) => {
    await changeLocale(newLocale, ctx);

    // Store locale in cookie 
    document.cookie = `locale=${JSON.stringify(newLocale)};max-age=86400;path=/`;
  });

  return (
    <div>
      <div>{t('app.changeLocale@@Change locale')}</div>
      {config.supportedLocales.map(value => (
        <button onClick$={async () => await changeLocale$(value)}>
          {value.lang}
        </button>
      ))}
    </div>
  );
});
```
and add the component in `header.tsx`:

_src/components/header/header.tsx_
```jsx
export default component$(() => {
  return (
    <header>
      <ChangeLocale />
    </header>
  );
});
```
`changeLocale` function by Qwik Speak is responsible for the language change, and it falls back to the default locale if the new locale is not in `supportedLocales`.

## Extraction: [Qwik Speak Extract](../tools/extract.md)
We can now extract the translations and generate the `assets` as json. In `package.json` add the following command to the scripts:
```json
"qwik-speak-extract": "qwik-speak-extract --supportedLangs=en-US,it-IT"
```

```shell
npm run qwik-speak-extract
```

The following files are generated:
```
public/i18n/en-US/app.json
public/i18n/en-US/home.json
public/i18n/it-IT/app.json
public/i18n/it-IT/home.json
```
`app` asset and `home` asset for each language, initialized with the default values we provided.

We can translate the `it-IT` files, and run the app.

## Running
You can try the app: `npm start`

## Inlining: [Qwik Speak Inline Vite plugin](../tools/inline.md)
Let's make sure that translation files are loaded only in dev mode. Update the `loadTranslation$` function:

_src/speak-config.ts_
```typescript
import { isDev } from '@builder.io/qwik/build';

export const loadTranslation$: LoadTranslationFn = $(async (lang: string, asset: string, origin?: string) => {
  if (isDev) {
    let url = '';
    // Absolute urls on server
    if (isServer && origin) {
      url = origin;
    }
    url += `/i18n/${lang}/${asset}.json`;
    const response = await fetch(url);
    return response.json();
  }
});
```
and add `qwikSpeakInline` Vite plugin in `vite.config.ts`:
```typescript
import { qwikSpeakInline } from 'qwik-speak/inline';

export default defineConfig(() => {
  return {
    build: {
      minify: false // To inspect production files
    },
    plugins: [
      qwikCity(),
      qwikVite(),
      qwikSpeakInline({
        supportedLangs: ['en-US', 'it-IT'],
        defaultLang: 'en-US',
      }),
      tsconfigPaths(),
    ],
  };
});
```

Build the production app in preview mode:
```typescript
npm run preview
```

> The app will have the same behavior as you saw in dev mode, but now the translations are inlined as you can verify by inspecting the production files, reducing resource usage at runtime.

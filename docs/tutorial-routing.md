# Tutorial: localized routing with prefix only

> Step by step, let's build a sample app with Qwik Speak and a localized router using Qwik City features

```shell
npm create qwik@latest
npm install qwik-speak --save-dev
```

## Configuration
Let's create `speak-config.ts` and `speak-functions.ts` files in `src`:

_src/speak-config.ts_
```typescript
import type { SpeakConfig } from 'qwik-speak';

export const config: SpeakConfig = {
  defaultLocale: { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles' },
  supportedLocales: [
    { lang: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome' },
    { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles' }
  ],
  assets: [
    'app' // Translations shared by the pages
  ]
};
```
_src/speak-functions.ts_
```typescript
import { server$ } from '@builder.io/qwik-city';
import type { LoadTranslationFn, Translation, TranslationFn } from 'qwik-speak';

/**
 * Translation files are lazy-loaded via dynamic import and will be split into separate chunks during build.
 * Keys must be valid variable names
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
We have added the Speak config and the implementation of the `loadTranslation$` function to load translation files.

> `loadTranslation$` is a customizable QRL function: you can load the translation files in the way you prefer

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

Now let's handle it. Create `plugin.ts` in the root of the `src/routes` directory:

_src/routes/plugin.ts_
```typescript
import { config } from '../speak-config';

export const onRequest: RequestHandler = ({ params, locale }) => {
  // Check supported locales
  const supportedLocale = config.supportedLocales.find(value => value.lang === params.lang)

  // Check for 404 error page
  const lang = supportedLocale
    ? supportedLocale.lang
    : !params.lang && config.defaultLocale.lang

  if(!lang) throw error(404, 'Page not found');

  // Set Qwik locale
  locale(lang);
};
```
We assign the value of the `lang` parameter to Qwik `locale`. This way it will be immediately available to the library.

## Adding Qwik Speak
Just wrap Qwik City provider with `QwikSpeakProvider` component in `root.tsx` and pass it the configuration and the translation functions:

_src/root.tsx_
```tsx
import { QwikSpeakProvider } from 'qwik-speak';

import { config } from './speak-config';
import { translationFn } from './speak-functions';

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

Finally we add an `index.tsx` with some translation, providing default values for each translation: `key@@[default value]`:

_src/routes/[...lang]/index.tsx_
```tsx
import {
  useTranslate,
  useFormatDate,
  useFormatNumber,
  Speak,
} from 'qwik-speak';

export const Home = component$(() => {
  const t = useTranslate();
  const fd = useFormatDate();
  const fn = useFormatNumber();

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
    /**
     * Add Home translations (only available in child components)
     */
    <Speak assets={['home']}>
      <Home />
    </Speak>
  );
});

export const head: DocumentHead = {
  title: 'home.head.title@@Qwik Speak',
  meta: [{ name: 'description', content: 'home.head.description@@Qwik Speak with localized routing' }]
};
```

## Scoped translation
We have used the `Speak` component to add scoped translations to the `Home` component:
- `Home` component will use the `home` asset, in addition to the `app` asset that comes with the configuration
- Using the asset name `home` as the root property in each key is the best practice to avoid keys in different files being overwritten

> `Speak` component is a `Slot` component: because Qwik renders `Slot` components and direct children in isolation, translations are not immediately available in direct children, and we need to use a component for the `Home` page. It is not necessary to use more than one `Speak` component per page

## Head metas
You may have noticed, that in `index.tsx` we have provided the meta title and description with only the keys. Since the Qwik City `DocumentHead` is out of context, we need to do the translations directly in `router-head.tsx`:

_src/components/router-head/router-head.tsx_
```tsx
export const RouterHead = component$(() => {
  const t = useTranslate();

  const head = useDocumentHead();

  return (
    <>
      <title>{t(head.title, { name: 'Qwik Speak' })}</title>

      {head.meta.map((m) => (
        <meta key={m.key} name={m.name} content={m.name === 'description' ? t(m.content!) : m.content} />
      ))}
    </>
  );
});
```

We can also pass the `lang` attribute in the html tag:

_src/entry.ssr.tsx_
```typescript
import { config } from './speak-config';

export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    manifest,
    ...opts,
    // Use container attributes to set attributes on the html tag
    containerAttributes: {
      lang: opts.serverData?.locale || config.defaultLocale.lang,
      ...opts.containerAttributes,
    },
  });
}
```

## Change locale
Now we want to change locale. Let's create a `ChangeLocale` component:

_src/components/change-locale.tsx_
```tsx
import type { SpeakLocale } from 'qwik-speak';
import { useSpeakConfig, useTranslate } from 'qwik-speak';

export const ChangeLocale = component$(() => {
  const t = useTranslate();

  const loc = useLocation();
  const config = useSpeakConfig();

  // Replace the locale and navigate to the new URL
  const navigateByLocale$ = $((newLocale: SpeakLocale) => {
    const url = new URL(location.href);
    if (loc.params.lang) {
      if (newLocale.lang !== config.defaultLocale.lang) {
        url.pathname = url.pathname.replace(loc.params.lang, newLocale.lang);
      } else {
        url.pathname = url.pathname.replace(new RegExp(`(/${loc.params.lang}/)|(/${loc.params.lang}$)`), '/');
      }
    } else if (newLocale.lang !== config.defaultLocale.lang) {
      url.pathname = `/${newLocale.lang}${url.pathname}`;
    }

    location.href = url.toString();
  });

  return (
    <div>
      <h2>{t('app.changeLocale@@Change locale')}</h2>
      {config.supportedLocales.map(value => (
        <button key={value.lang} onClick$={async () => await navigateByLocale$(value)}>
          {value.lang}
        </button>
      ))}
    </div>
  );
});
```
and add the component in `header.tsx`:
```tsx
export default component$(() => {
  return (
    <header>
      <ChangeLocale />
    </header>
  );
});
```
In `navigateByLocale$` we replace the language in the URL, before navigating to the new localized URL.

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
i18n/en-US/home.json
i18n/it-IT/app.json
i18n/it-IT/home.json
translations skipped due to dynamic keys: 2
extracted keys: 4
```
`app` asset and `home` asset for each language, initialized with the default values we provided.

_translations skipped due to dynamic keys_ are meta title and description keys, because those keys are passed as dynamic parameters. We have to add them manually in a new file that we will call `runtime`:

_i18n/[lang]/runtime.json_
```json
{
  "runtime": {
    "home": {
      "head": {
        "title": "Qwik Speak",
        "description": "Qwik Speak with localized routing"
      }
    }
  }
}
```
Update the keys in `DocumentHead` of `index.tsx`:
```tsx
export const head: DocumentHead = {
  title: 'runtime.home.head.title@@Qwik Speak',
  meta: [{ name: 'description', content: 'runtime.home.head.description@@Qwik Speak with localized routing' }]
};
```
and add `runtime` asset in Speak config:
```typescript
assets: [
  'app' // Translations shared by the pages
],
runtimeAssets: [
  'runtime' // Translations with dynamic keys or parameters
]
```

See [Qwik Speak Extract](./extract.md) for more details.

## Translation
We can translate the `it-IT` files.

If you have an OpenAI API key, you could use `gpt-translate-json` package:
```shell
npm install gpt-translate-json --save-dev
```
In `package.json` add the following command to the scripts:
```json
"gpt-translate-json": "gpt-translate-json --apiKey=openai_api_key --model=gpt-3.5-turbo --maxTokens=3000 --langs=en-US,it-IT --originalLang=en-US"
```

```shell
npm gpt-translate-json
```

Run the app:
```shell
npm start
```

See [GPT Translate JSON](./gpt-translate-json.md) for more details.

## Production
In production mode, `assets` are loaded only during SSR, and to get the translations on the client as well it is required to inline the translations in chucks sent to the browser.

Add `qwikSpeakInline` Vite plugin in `vite.config.ts`:
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
Set the base URL for loading the chunks in the browser in `entry.ssr.tsx` file:
```typescript
import { isDev } from '@builder.io/qwik/build';

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
Build the production app in preview mode:
```shell
npm run preview
```
Inspect the `qwik-speak-inline.log` file in root folder:

```
client: root.tsx
dynamic key: t(head.title) - Make sure the keys are in 'runtimeAssets'
dynamic key: t(m.content) - Make sure the keys are in 'runtimeAssets'
```
It contains the non-inlined dynamic keys that we added in the `runtime.json` file.

> The app will have the same behavior as you saw in dev mode, but now the translations are inlined as you can verify by inspecting the production files, reducing resource usage at runtime

See [Qwik Speak Inline Vite plugin](./inline.md) for more details.

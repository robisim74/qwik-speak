# Tutorial: localized routing

> Step by step, let's build an app with Qwik Speak and a localized router

> Requires Qwik city 0.1.*

```shell
npm create qwik@latest
npm install qwik-speak --save-dev
```

## Configuration
Let's create a `speak-config.ts` file in `src`:

_src/speak-config.ts_
```typescript
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

## Routing
Let's assume that we want to create a navigation of this type:
- default language (en-US): routes not localized `http://127.0.0.1:5173/`
- other languages (it-IT): localized routes `http://127.0.0.1:5173/it-IT/`

In `routes` root level add `[...lang]` directory to catch all routes:
```
src/routes/
│   
└───[...lang]/
        index.tsx
    layout.tsx
```

Now let's handle it in `layout.tsx`. After the default `component$`, we add:

_src/routes/layout.tsx_
```typescript
export const onRequest: RequestHandler = ({ params, locale }) => {
  const lang = params.lang;

  // Set Qwik locale
  locale(lang || config.defaultLocale.lang);
};
```
We assign the value of the `lang` parameter to Qwik `locale`. This way it will be immediately available to the library.

## Adding Qwik Speak
Just wrap Qwik City provider with `QwikSpeakProvider` component in `root.tsx` and pass it the configuration and the translation functions:

_src/root.tsx_
```jsx
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

_src/routes/[...lang]/index.tsx_
```jsx
import {
  $translate as t,
  formatDate as fd,
  formatNumber as fn,
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

export const head: DocumentHead = {
  title: 'home.head.title@@Qwik Speak',
  meta: [{ name: 'description', content: 'home.head.description@@Qwik Speak with localized routing' }]
};
```
Here we have used the `Speak` component to add scoped translations to the home page. This means that in addition to the `app` asset that comes with the configuration, the home page will also use the `home` asset. To distinguish them, `app` asset keys start with `app` and home asset keys start with `home`.

We are also providing default values for each translation: `key@@[default value]`.

## Head metas
You may have noticed, that in `index.tsx` we have provided the meta title and description with only the keys. Since the Qwik City `DocumentHead` is out of context, we need to do the translations directly in `router-head.tsx`:

_src/components/router-head/router-head.tsx_
```jsx
<title>{t(head.title)}</title>

{head.meta.map((m) => (
  <meta name={m.name} content={m.name === 'description' ? t(m.content!) : m.content} />
))}
```

We can also pass the `lang` attribute in the html tag:

_src/entry.ssr.tsx_
```typescript
export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    manifest,
    ...opts,
    // Use container attributes to set attributes on the html tag.
    containerAttributes: {
      lang: opts.serverData?.locale || config.defaultLocale.lang,
      ...opts.containerAttributes,
    },
  });
}
```

## Change locale
Now we want to change locale without reloading the page, just rerendering components that use translations. Let's create a `ChangeLocale` component:

_src/components/header/change-locale.tsx_
```jsx
export const ChangeLocale = component$(() => {
  const loc = useLocation();
  const nav = useNavigate();

  const ctx = useSpeakContext();
  const locale = useSpeakLocale();
  const config = useSpeakConfig();

  // Handle localized routing
  useTask$(async ({ track }) => {
    track(() => loc.params.lang);

    const newLocale = config.supportedLocales.find(value => value.lang === loc.params.lang) || config.defaultLocale;
    if (newLocale.lang !== locale.lang) {
      await changeLocale(newLocale, ctx);
    }
  });

  // Replace locale in URL
  const localizeUrl$ = $(async (newLocale: SpeakLocale) => {
    let pathname = loc.pathname;
    if (loc.params.lang) {
      if (newLocale.lang !== config.defaultLocale.lang) {
        pathname = pathname.replace(loc.params.lang, newLocale.lang);
      } else {
        pathname = pathname.replace(new RegExp(`(/${loc.params.lang}/)|(/${loc.params.lang}$)`), '/');
      }
    } else if (newLocale.lang !== config.defaultLocale.lang) {
      pathname = `/${newLocale.lang}${pathname}`;
    }

    // No full-page reload
    nav(pathname);
  });

  return (
    <div>
      <div>{t('app.changeLocale@@Change locale')}</div>
      {config.supportedLocales.map(value => (
        <button onClick$={async () => await localizeUrl$(value)}>
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
`changeLocale` function by Qwik Speak is responsible for the language change, and it falls back to the default locale if the new locale is not in `supportedLocales`. We use it in `useTask$` to handle also user actions, like page back/forward.

In `localizeUrl$` we replace the language in the URL, using the Qwik City navigation API, therefore without reloading the page.

> As an alternative you could avoid calling `changeLocale`, you could just navigate directly to the new localized URL. This may be necessary in production if you have different domains for each location.

## Running
You can already try the app: `npm start`

You will notice that in the translations there are default values for both languages, and that when you change language the URL updates.

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

_Skipped keys due to dynamic params_ are meta title and description keys, because those keys are passed as dynamic parameters to the `$translate` function. We have to add them manually in a new file that we will call `runtime`:

_public/i18n/[lang]/runtime.json_
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
> Don't forget to update the keys in `DocumentHead` of `index.tsx` and add `runtime` asset in Speak config.

We can translate the `it-IT` files, and run the app again.

## Inlining: [Qwik Speak Inline Vite plugin](../tools/inline.md)
Let's make sure that the `runtime` file is loaded and others only in dev mode. Update the `loadTranslation$` function:

_src/speak-config.ts_
```typescript
export const loadTranslation$: LoadTranslationFn = $(async (lang: string, asset: string, origin?: string) => {
  if (import.meta.env.DEV || asset === 'runtime') {
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

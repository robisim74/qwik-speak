# Tutorial: localized routing

> Step by step, let's build an app with Qwik Speak and a localized router

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
  const data = await fetch(url);
  return data.json();
});

export const translationFn: TranslationFn = {
  loadTranslation$: loadTranslation$
};
```
We have added the Speak config and the implementation of the `loadTranslation$` function. Loading of translations can take place both on server and on client (in case of SPA or language change) and the `loadTranslation$` function must support both.

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

_src/routes/[...lang]/layout.tsx_
```typescript
export const onRequest: RequestHandler = ({ request, response, params }) => {
  let lang = params.lang?.replace(/^\/|\/$/g, '');

  // Set locale in response
  response.locale = lang || config.defaultLocale.lang;

  // Redirect if the language is different from the default language
  if (!lang) {
    const cookie = request.headers?.get('cookie');
    const acceptLanguage = request.headers?.get('accept-language');

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

    if (lang !== config.defaultLocale.lang) {
      if (config.supportedLocales.find(x => x.lang === lang)) {
        const url = new URL(request.url);
        throw response.redirect(`/${lang}${url.pathname}`, 302);
      }
    }
  }
};
```
Here we are doing two things:
- first we assign to the response the value of the `lang` parameter or the default one. This way it will be immediately available to the library;
- secondly, if `lang` parameter is not defined we redirect based on the locale saved in a cookie (which we will set later) or based on the user's language if available. Note that we are on the server, and we need to get these values from the request headers.

## Adding Qwik Speak
Just wrap Qwik City provider with Qwik Speak component in `root.tsx` and pass it the configuration and translation functions:

_src/root.tsx_
```jsx
export default component$(() => {
  return (
    <QwikSpeak config={config} translationFn={translationFn}>
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
    </QwikSpeak>
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
Here we have used the Speak component to add scoped translations to the home page. This means that in addition to the `app` asset that comes with the configuration, the home page will also use the `home` asset. To distinguish them, `app` asset keys start with `app` and home asset keys start with `home`.

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
      lang: opts.envData?.locale?.replace(/^\/|\/$/g, '') || config.defaultLocale.lang,
      ...opts.containerAttributes,
    },
  });
}
```

## Change locale
We now want to change locale without reloading the page, just rerendering components that use translations. Let's create a `ChangeLocale` component:

_src/components/header/change-locale.tsx_
```jsx
export const ChangeLocale = component$(() => {
  const loc = useLocation();
  const nav = useNavigate();

  const ctx = useSpeakContext();

  const changeLocale$ = $(async (locale: SpeakLocale) => {
    await changeLocale(locale, ctx);

    // Store locale in cookie 
    document.cookie = `locale=${JSON.stringify(locale)};max-age=86400;path=/`;

    // Replace locale in URL
    let pathname = loc.pathname;
    if (loc.params.lang) {
      if (locale.lang !== config.defaultLocale.lang) {
        pathname = pathname.replace(loc.params.lang, locale.lang);
      } else {
        pathname = pathname.replace(new RegExp(`(/${loc.params.lang}/)|(/${loc.params.lang}$)`), '/');
      }
    } else if (locale.lang !== config.defaultLocale.lang) {
      pathname = `/${locale.lang}${pathname}`;
    }

    // No full-page reload
    nav.path = pathname;
  });

  return (
    <div>
      <div>{t('app.changeLocale@@Change locale')}</div>
      {ctx.config.supportedLocales.map(locale => (
        <button onClick$={async () => await changeLocale$(locale)}>
          {locale.lang}
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
`changeLocale` function by Qwik Speak is responsible for the language change. Then we store the locale in a cookie (which we handled in layout) and replace the language in the URL, using the Qwik City navigation API, therefore without reloading the page.

## Running
You can already try the app: `npm start`

You will notice that in the translations there are default values for both languages, and that when you change language the URL updates.

## Extraction [Qwik Speak Extract](../tools/extract.md)
We can now extract the translations and generate the translation files (assets) as json. In `package.json` add the following command to the scripts:
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

## Inlining [Qwik Speak Inline Vite plugin](../tools/inline.md)
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
    const data = await fetch(url);
    return data.json();
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

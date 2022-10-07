# Qwik Speak Inline Vite plugin

> Inline Qwik Speak `$translate` function at compile time

## Usage
### Build using Qwik Speak Inline Vite plugin
#### Prepare the code
Make sure that the translation files are only loaded in dev mode, for example:
```typescript
export const loadTranslation$: LoadTranslationFn = $(async (lang: string, asset: string, url?: URL) => {
  if (import.meta.env.DEV ) {
    // Load translations
  }
});
```
Likewise, be sure to store the locale, for example through a cookie, and to navigate/reload the page when the locale changes:
```typescript
export const storeLocale$: StoreLocaleFn = $((locale: SpeakLocale, url?: URL) => {
  // Store locale in cookie 
  document.cookie = `locale=${JSON.stringify(locale)};path=/`;

  if (url) {
    // Localize the route
    /* ... */

    if (import.meta.env.DEV) {
      window.history.pushState({}, '', url);
    } else {
      window.location.href = url.pathname;
    }
  }
});
```
Wherever you want in the body, add the `QwikSpeakInline` component:
```jsx
import { QwikSpeak } from 'qwik-speak';

export default component$(() => {
  return (
    <QwikSpeak config={config} translateFn={translateFn}>
      <QwikCity>
        <head></head>
        <body>
          <RouterOutlet />
          <QwikSpeakInline />
        </body>
      </QwikCity>
    </QwikSpeak>
  );
});
```
#### Configure
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
        defaultLang: 'en-US'
      }),
    ],
  };
});
```
and build the app.

At the end of the build, in root folder a `qwik-speak.log` file is generated which contains:
- Missing values
- Translations with dynamic keys
- Translations with dynamic params

### Build using Qwik Speak Inline Vite plugin & runtime
When there are translations with dynamic keys or params, you can manage them at runtime as follows:
- Insert dynamic translations into separate files, such as `runtime.json`
- Handlee these files when they are loaded:
  
  ```typescript
  export const config: SpeakConfig = {
    /* ... */
    assets: [
      'app', // Translations shared from the whole app
      'runtime' // Translations with dynamic keys or parameters
    ]
  };
  ```
  ```typescript
  export const loadTranslation$: LoadTranslationFn = $(async (lang: string, asset: string, url?: URL) => {
    if (import.meta.env.DEV || asset === 'runtime') {
      // Load translations
    }
  });
  ```
Likewise, you can also create lazy loaded runtime files for the different pages.

> Note. The `plural` function must be handled as a dynamic translation

## How it works
During the transformation of the modules, and before tree shaking and bundling, the `$translate` function (or its alias) is replaced with the translation values for the languages provided, for example from:
```javascript
/*#__PURE__*/ _jsx("h2", {
    children: t('app.subtitle')
}),
/*#__PURE__*/ _jsx("p", {
    children: t('home.greeting', {
        name: 'Qwik Speak'
    })
}),
```
to:
```javascript
/*#__PURE__*/ _jsx("h2", {
    children: $lang === `it-IT` && `Traduci le tue app Qwik in qualsiasi lingua` || `Translate your Qwik apps into any language`
}),
/*#__PURE__*/ _jsx("p", {
    children: $lang === `it-IT` && `Ciao! Sono ${'Qwik Speak'}` || `Hi! I am ${'Qwik Speak'}`
}),
```
`$lang` is a global variable set by `QwikSpeak` component on server, and by `QwikSpeakInline` component on client.

### Build an app for each language
You can also build a different app for each language. Just provide one language at a time and iterate through the build process (for both server and client files):
```javascript
const build = async (lang) => {
  await build({
    build: {
      /* ... */
    },
    plugins: [
      qwikVite({
        client: {
          /* ... */
        }
      }),
      qwikSpeakInline({
        supportedLangs: [lang],
        defaultLang: lang
      }),
    ],
  });
};
```
Result:
```javascript
/*#__PURE__*/ _jsx("h2", {
    children: `Translate your Qwik apps into any language`
}),
/*#__PURE__*/ _jsx("p", {
    children: `Hi! I am ${'Qwik Speak'}`
}),
```
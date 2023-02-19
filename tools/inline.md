# Qwik Speak Inline Vite plugin

> Inline Qwik Speak `$translate` function at compile time

## Usage
### Build using Qwik Speak Inline Vite plugin
#### Get the code ready
Make sure that the translation files are only loaded in dev mode, for example:
```typescript
import { isDev } from '@builder.io/qwik/build';

export const loadTranslation$: LoadTranslationFn = $(async (lang: string, asset: string, origin?: string) => {
  if (isDev) {
    // Load translations
  }
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
        basePath: './',
        assetsPath: 'public/i18n',
        supportedLangs: ['en-US', 'it-IT'],
        defaultLang: 'en-US'
      }),
    ],
  };
});
```
and build the app.

At the end of the build, in root folder a `qwik-speak-inline.log` file is generated which contains:
- Missing values
- Translations with dynamic keys
- Translations with dynamic params

> Note. Currently, only `json` files are supported as assets

### Build using Qwik Speak Inline Vite plugin & runtime
When there are translations with dynamic keys or params, you can manage them at runtime as follows:
- Insert dynamic translations into separate files, such as `runtime.json`
- Handle these files when they are loaded:
  
  ```typescript
  export const config: SpeakConfig = {
    /* ... */
    assets: [
      'app', // Translations shared by the pages
      'runtime' // Translations with dynamic keys or parameters
    ]
  };
  ```
  ```typescript
  export const loadTranslation$: LoadTranslationFn = $(async (lang: string, asset: string, origin?: string) => {
    if (isDev || asset === 'runtime') {
      // Load translations
    }
  });
  ```
Likewise, you can also create scoped runtime files for different pages.

## How it works
During the transformation of the modules, and before tree shaking and bundling, the `$translate` function (or its alias) is replaced with the translation values for the languages provided, both in server files and in chunks sent to the browser. For example from:
```javascript
/*#__PURE__*/ _jsx("h2", {
    children: t('app.subtitle')
}),
```
to:
```javascript
/*#__PURE__*/ _jsx("h2", {
    children: $lang(`it-IT`) && `Traduci le tue app Qwik in qualsiasi lingua` || `Translate your Qwik apps into any language`
}),
```
`$lang` is imported and added during compilation, and you can still change locales at runtime without redirecting or reloading the page.

## Advanced inlining
If you have many languages, or long texts, you can further optimize the chunks sent to the browser by enabling the `splitChunks` option :
```typescript
qwikSpeakInline({
  basePath: './',
  assetsPath: 'public/i18n',
  supportedLangs: ['en-US', 'it-IT'],
  defaultLang: 'en-US',
  splitChunks: true
})
```
In this way the browser chunks are generated one for each language:
```
dist/build/
│   
└───en-US/
│       q-*.js
└───it-IT/
        q-*.js
```
Each contains only its own translation:
```javascript
/* @__PURE__ */ Ut("h2", {
  children: `Translate your Qwik apps into any language`
}),
```
```javascript
/* @__PURE__ */ Ut("h2", {
  children: `Traduci le tue app Qwik in qualsiasi lingua`
}),
```

Qwik uses the `q:base` attribute to determine the base URL for loading the chunks in the browser, so you have to set it in `entry.ssr.tsx` file. For example, if you have a localized router:
```typescript
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
    base: extractBase,
  });
}
```

> Note. To update the `q:base` when language changes, you need to navigate to the new localized URL or reload the page. Therefore, it is not possible to use the `changeLocale` function

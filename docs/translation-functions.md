# Translation functions

> Note. It is recommended to put these functions in a separate file from the configuration, to allow the Qwik compiler to respect the initialization order of the functions

## loadTranslation$
`loadTranslation$` is the core function of the library. It is a customizable QRL function, with which you can load the translation files in the way you prefer.

### Fetching files
You can fetch files from the _public_ folder:

```typescript
const loadTranslation$ = server$(async function (lang: string, asset: string) {
  // Absolute urls on server
  const url = `${this.url.origin}/i18n/${lang}/${asset}.json`;
  const response = await fetch(url);

  if (response.ok) {
    return response.json();
  }
  else {
    console.error(`loadTranslation$: ${url}`, response);
  }
});
```

### Bundling files
#### Dynamic import
To improve performance, it is recommended to bundle translation files instead of fetching them:
```typescript
/**
 * Translation files are lazy-loaded via dynamic import and will be split into separate chunks during build.
 * Keys must be valid variable names
 */
const translationData = import.meta.glob<Translation>('/i18n/**/*.json');

const loadTranslation$: LoadTranslationFn = server$((lang: string, asset: string) =>
  translationData[`/i18n/${lang}/${asset}.json`]?.()
);
```
> Using `server$` instead of `$`, translation data is always accessed on the server

We could also catch errors during development:
```typescript
const loadTranslation$: LoadTranslationFn = server$((lang: string, asset: string) => {
  const langAsset = `/i18n/${lang}/${asset}.json`;
  if (langAsset in translationData) {
    return translationData[langAsset]();
  }
  if (isDev) {
    console.warn(`loadTranslation$: ${langAsset} not found`);
  }
  return null;
});
```
#### Dynamic import as string
If your keys are not valid variable names, you can import files as strings:
```typescript
/**
 * Translation files are lazy-loaded via dynamic import and will be split into separate chunks as strings during build
 */
const translationData = import.meta.glob('/i18n/**/*.json', { as: 'raw' });

const loadTranslation$: LoadTranslationFn = server$((lang: string, asset: string) =>
  JSON.parse(translationData[`/i18n/${lang}/${asset}.json`])
);
```
Refer to _Vite_ documentation for more information on [Glob import](https://vitejs.dev/guide/features.html#glob-import)
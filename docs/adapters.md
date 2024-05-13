# Qwik Speak and Adapters

> If you use Qwik-provided adapters for publishing your app, especially with _edge functions_ or _static generation_, it is recommended to bundle the translation files (see [Translation functions](./translation-functions.md))

If your production environment doesn't support _dynamic import_, you can import files directly:
```typescript
/**
 * Translation files are imported directly as string
 */
const translationData = import.meta.glob<Translation>('/i18n/**/*.json', { as: 'raw', eager: true });

const loadTranslation$: LoadTranslationFn = server$((lang: string, asset: string) =>
  JSON.parse(translationData[`/i18n/${lang}/${asset}.json`])
);
```

## Static Site Generation (SSG)
If you want to use Static Site Generation, you need to generate for each supported language an `index.html` of each page you will include in SSG.

### Get the code ready
- Bundle the translation files (see [Translation functions](./translation-functions.md)) or provide a running server during the build if you are fetching the files
- Configure a localized router with a `lang` parameter
- Handle the dynamic `lang` parameter, adding the values it can take to each page included in SSG, e.g.:

_src/routes/[...lang]/index.tsx_
```typescript
export const onStaticGenerate: StaticGenerateHandler = () => {
  return {
    params: config.supportedLocales.map(locale => {
      return { lang: locale.lang !== config.defaultLocale.lang ? locale.lang : '.' };
    })
  };
};
```
> See [Dynamic SSG routes](https://qwik.builder.io/docs/guides/static-site-generation/#dynamic-ssg-routes) in official Qwik docs for more details

### Building
```shell
npm run build
```
Inspect the `dist` folder: you should have for each language an `index.html` of each page you have included in SSG.

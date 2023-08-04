# Qwik Speak and Adapters

> If you use Qwik-provided adapters for publishing your app, especially with _edge functions_ or _static generation_, it is recommended to bundle the translation files (see [Translation functions](./translation-functions.md))

If your production environment doesn't support _dynamic import_, you can import files directly:
```typescript
/**
 * Translation files are imported directly as string
 */
const translationData = import.meta.glob('/i18n/**/*.json', { as: 'raw', eager: true });

const loadTranslation$: LoadTranslationFn = server$((lang: string, asset: string) =>
  JSON.parse(translationData[`/i18n/${lang}/${asset}.json`])
);
```

## Static Site Generation (SSG)
If you want to use Static Site Generation with the localized router, it is necessary to manage the dynamic language parameter, and you need to add the values it can take to the pages that will be pre-rendered:

```typescript
/**
 * Dynamic SSG route
 */
export const onStaticGenerate: StaticGenerateHandler = () => {
  return {
    params: config.supportedLocales.map(locale => {
      return { lang: locale.lang !== config.defaultLocale.lang ? locale.lang : '.' };
    })
  };
};
```

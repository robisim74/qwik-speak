# Qwik Speak and Adapters

If you use Qwik-provided adapters for publishing your app, especially with edge functions or static generation, it is recommended to bundle the translation files when possible:
```typescript
/**
 * Translation files are lazy-loaded via dynamic import and will be split into separate chunks during build
 */
const translationData = import.meta.glob('/public/i18n/**/*.json');

const loadTranslation$: LoadTranslationFn = server$(async (lang: string, asset: string) =>
  await translationData[`/public/i18n/${lang}/${asset}.json`]()
);
```
> Using `server$`, translation data is always accessed on the server

If your production environment doesn't support dynamic import, you might prefer this way:
```typescript
/**
 * Translation files are imported directly as string
 */
const translationData = import.meta.glob('/public/i18n/**/*.json', { as: 'raw', eager: true });

const loadTranslation$: LoadTranslationFn = server$((lang: string, asset: string) =>
  JSON.parse(translationData[`/public/i18n/${lang}/${asset}.json`])
);
```

## Static Site Generation (SSG)
If you want to use Static Site Generation with the localized router, it is necessary to manage the dynamic language parameter, and you need to add the values it can take to the pages:

```typescript
/**
 * Dynamic SSG route
 */
export const onStaticGenerate: StaticGenerateHandler = () => {
  return {
    params: config.supportedLocales.map(locale => {
      return { lang: locale.lang !== config.defaultLocale.lang ? locale.lang : '' };
    })
  };
};
```

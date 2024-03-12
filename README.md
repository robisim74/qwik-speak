# Qwik Speak
[![Node.js CI](https://github.com/robisim74/qwik-speak/actions/workflows/node.js.yml/badge.svg)](https://github.com/robisim74/qwik-speak/actions/workflows/node.js.yml) [![Playwright](https://github.com/robisim74/qwik-speak/actions/workflows/playwright.yml/badge.svg)](https://github.com/robisim74/qwik-speak/actions/workflows/playwright.yml)

> Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps

```shell
npm install qwik-speak --save-dev
```

## Getting Started
- [Quick Start](./docs/quick-start.md)
- [Tutorial: localized routing with the language](./docs/tutorial-routing.md)
- [Tutorial: translated routing with url rewriting](./docs/tutorial-routing-rewrite.md)
- [Translate](./docs/translate.md)
- [Translation functions](./docs/translation-functions.md)
- [Lazy loading translation](./docs/lazy-loading.md)
- [Qwik Speak and Adapters](./docs/adapters.md)
- [Testing](./docs/testing.md)

Live example on [Cloudflare pages](https://qwik-speak.pages.dev/) and playground on [CodeSandbox](https://codesandbox.io/p/github/robisim74/qwik-speak)

## Overview
### Getting the translation
```tsx
import { inlineTranslate } from 'qwik-speak';

export default component$(() => {
  const t = inlineTranslate();

  return (
    <>
      <h1>{t('title@@Qwik Speak')}</h1> {/* Qwik Speak */}
      <p>{t('greeting@@Hi! I am {{name}}', { name: 'Qwik Speak' })}</p> {/* Hi! I am Qwik Speak */}
    </>
  );
});
```
You can pass only the default values by enabling the automatic key generation option:
```tsx
import { inlineTranslate } from 'qwik-speak';

export default component$(() => {
  const t = inlineTranslate();

  return (
    <>
      <h1>{t('Qwik Speak')}</h1> {/* Qwik Speak */}
      <p>{t('Hi! I am {{name}}', { name: 'Qwik Speak' })}</p> {/* Hi! I am Qwik Speak */}
    </>
  );
});
```
See [Translate](./docs/translate.md) and [Automatic key generation](./docs/translate.md#automatic-key-generation) for more details.

### Getting dates, relative time & numbers
```tsx
import { useFormatDate, useRelativeTime, useFormatNumber } from 'qwik-speak';

export default component$(() => {
  const fd = useFormatDate();
  const rt = useRelativeTime();
  const fn = useFormatNumber();

  return (
    <>
      <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p> {/* Wednesday, July 20, 2022 at 7:09 AM */}
      <p>{rt(-1, 'second')}</p> {/* 1 second ago */}
      <p>{fn(1000000, { style: 'currency' })}</p> {/* $1,000,000.00 */}
    </>
  );
});
```
See [Localize](./docs/translate.md#localize) for more details.

## Static translations
Translation are loaded and inlined in chunks sent to the browser during the build.

See [Qwik Speak Inline Vite plugin](./docs/inline.md) for more information on how it works and how to use it.

## Extraction of translations
To extract translations directly from the components, a command is available that automatically generates the files with the keys and default values.

See [Qwik Speak Extract](./docs/extract.md) for more information on how to use it.

## Automatic translation
To automatically translate files, the following external packages are available:
- [GPT Translate JSON](https://github.com/robisim74/gpt-translate-json)
- [Qwik Speak DeepL](https://www.npmjs.com/package/@tegonal/qwik-speak-deepl)

## Speak context
```mermaid
stateDiagram-v2
    State1: SpeakState
    State2: SpeakConfig
    State3: SpeakLocale
    State4: TranslationFn
    State5: Translation
    State1 --> State2
    State1 --> State3
    State1 --> State4
    State1 --> State5
    note right of State2: configuration
    note right of State3
        - lang
        - extension (Intl)
        - currency
        - timezone
        - unit
        - dir
        - domain
    end note 
    note right of State4
        - loadTranslation$
    end note
    note right of State5
        runtime assets
    end note
```
> `SpeakState` is immutable: it cannot be updated after it is created and is not reactive

### Speak config
- `defaultLocale` The default locale to use as fallback
- `supportedLocales` List of locales supported by the app
- `assets` Translation file names. Each asset is passed to the `loadTranslation$` function to obtain data according to the language
- `runtimeAssets` Assets available at runtime
- `keySeparator` Separator of nested keys. Default is `.`
- `keyValueSeparator` Key-value separator. Default is `@@`
- `rewriteRoutes` Rewrite routes as specified in Vite config for `qwikCity` plugin
- `domainBasedRouting` Domain-based routing options

### SpeakLocale
The `SpeakLocale` object contains the `lang`, in the format `language[-script][-region]`, where:
- `language` ISO 639 two-letter or three-letter code
- `script` ISO 15924 four-letter script code
- `region` ISO 3166 two-letter, uppercase code

and optionally contains:
- `extension` Language with Intl extensions, in the format `language[-script][-region][-extensions]` like `en-US-u-ca-gregory-nu-latn` to format dates and numbers
- `currency` ISO 4217 three-letter code
- `timeZone` From the IANA time zone database
- `units` Key value pairs of unit identifiers
- `dir` Text direction: `'ltr' | 'rtl' | 'auto'`
- `domain` In domain-based routing, set the default domain for the locale
- `withDomain` In domain-based routing, set another domain for the locale

### Translation functions
`TranslationFn` interface can be implemented to change the behavior of the library:
- `loadTranslation$` QRL function to load translation data

### Translation
`Translation` contains only the key value pairs of the translation data provided with the `runtimeAssets`

## APIs
### Providers
`useQwikSpeak(props: QwikSpeakProps)` provides the Speak context to the app. `QwikSpeakProps`:
  - `config` Speak config
  - `translationFn` Optional functions to use
  - `langs` Optional additional languages to preload data for (multilingual)
  - `currency` Optional currency if different from the current one
  - `timeZone` Optional time zone if different from the current one

`useSpeak(props: SpeakProps) ` can be used for lazy loading translation. `SpeakProps`:
  - `assets` Assets to load
  - `runtimeAssets` Assets to load available at runtime
  - `langs` Optional additional languages to preload data for (multilingual)

### Context
- `useSpeakContext()` Returns the Speak state
- `useSpeakConfig()` Returns the configuration in Speak context
- `useSpeakLocale()` Returns the locale in Speak context

### Translate
- `inlineTranslate: () => (keys: string | string[], params?: Record<string, any>, lang?: string)`
Translates a key or an array of keys. The syntax of the string is `key@@[default value]`

- `inlinePlural: () => (value: number | string, key?: string, params?: Record<string, any>, options?: Intl.PluralRulesOptions, lang?: string)`
Gets the plural by a number using [Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) API

### Localize
- `useFormatDate: () => (value: Date | number | string, options?: Intl.DateTimeFormatOptions, lang?: string, timeZone?: string)`
Formats a date using [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) API

- `useRelativeTime: () => (value: number | string, unit: Intl.RelativeTimeFormatUnit, options?: Intl.RelativeTimeFormatOptions, lang?: string)`
Formats a relative time using [Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) API

- `useFormatNumber: () => (value: number | string, options?: Intl.NumberFormatOptions, lang?: string, currency?: string)`
Formats a number using [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) API

- `useDisplayName: () => (code: string, options: Intl.DisplayNamesOptions, lang?: string)`
Returns the translation of language, region, script or currency display names using [Intl.DisplayNames](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames) API

### Routing
- `localizePath: () => (route: (string | URL) | string[], lang?: string)`
Localize a path, an URL or an array of paths with the language

- `translatePath: () => (route: (string | URL) | string[], lang?: string)`
Translates a path, an URL or an array of paths. The translating string can be in any language. If not specified the target lang is the current one

- `validateLocale(lang: string)`
Validate `language[-script][-region]`

- `extractFromUrl(route: URL)`
Extract prefix from url

- `extractFromDomain(route: URL, domains: SpeakLocale[] | RewriteRouteOption[])`
Extract lang/prefix from domain

### Testing
- `QwikSpeakMockProvider` component provides the Speak context to test enviroments

## Development Builds
### Library & tools
#### Build
```shell
cd packages/qwik-speak
npm install
npm run build
```
#### Test
```shell
npm test
```
### Sample app
#### Run
```shell
npm install
npm start
```
#### Preview
```shell
npm run preview
```
#### Test
```shell
npm test
npm run test.e2e
```

## License
MIT

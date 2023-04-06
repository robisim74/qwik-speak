# Qwik Speak ⚡️
[![Node.js CI](https://github.com/robisim74/qwik-speak/actions/workflows/node.js.yml/badge.svg)](https://github.com/robisim74/qwik-speak/actions/workflows/node.js.yml) [![Playwright](https://github.com/robisim74/qwik-speak/actions/workflows/playwright.yml/badge.svg)](https://github.com/robisim74/qwik-speak/actions/workflows/playwright.yml)

> Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps

```shell
npm install qwik-speak --save-dev
```

## Getting Started
- [Quick Start](./docs/quick-start.md)
- [Tutorial: localized routing](./docs/tutorial-routing.md)
- [Translate](./docs/translate.md)
- [Qwik Speak and Adapters](./docs/adapters.md)
- [Testing](./docs/testing.md)

Live example on [Cloudflare pages](https://qwik-speak.pages.dev/) and playground on [StackBlitz](https://stackblitz.com/edit/qwik-speak)

## Overview
### Getting the translation
```jsx
import { $translate as t } from 'qwik-speak';

export default component$(() => {
  return (
    <>
      <h1>{t('app.title@@Qwik Speak')}</h1> {/* Qwik Speak */}
      <p>{t('home.greeting@@Hi! I am {{name}}', { name: 'Qwik Speak' })}</p> {/* Hi! I am Qwik Speak */}
    </>
  );
});
```
### Getting dates, relative time & numbers
```jsx
import { formatDate as fd, relativeTime as rt, formatNumber as fn } from 'qwik-speak';

export default component$(() => {
  return (
    <>
      <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p> {/* Wednesday, July 20, 2022 at 7:09 AM */}
      <p>{rt(-1, 'second')}</p> {/* 1 second ago */}
      <p>{fn(1000000, { style: 'currency' })}</p> {/* $1,000,000.00 */}
    </>
  );
});
```

## Extraction of translations
To extract translations directly from the components, a command is available that automatically generates the files with the keys and default values.

See [Qwik Speak Extract](./docs/extract.md) for more information on how to use it.

## Production
Using _Qwik Speak Inline_ Vite plugin, translations are loaded and inlined during the build.

See [Qwik Speak Inline Vite plugin](./docs/inline.md) for more information on how it works and how to use it.

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
    end note 
    note right of State4
        - loadTranslation$
    end note
    note right of State5
        key-value pairs
        of translation data
    end note
```
`SpeakState` is immutable: it cannot be updated after it is created and is not reactive.

- `useSpeakContext()` Returns the Speak state
- `useSpeakConfig()` Returns the configuration in Speak context
- `useSpeakLocale()` Returns the locale in Speak context

### Speak config
- `defaultLocale` The default locale to use as fallback
- `supportedLocales` List of locales supported by the app
- `assets` An array of strings: each asset is passed to the `loadTranslation$` function to obtain data according to the language
- `runtimeAssets` Optional assets available at runtime
- `keySeparator` Separator of nested keys. Default is `.`
- `keyValueSeparator` Key-value separator. Default is `@@`

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

### Translation functions
`TranslationFn` interface can be implemented to change the behavior of the library:
- `loadTranslation$` Function to load translation data

## APIs
### Components
```mermaid
C4Container
    Container_Boundary(a, "App") {
        Component(a0, "QwikSpeakProvider", "", "Creates Speak context")
        Container_Boundary(b1, "Home") {
            Component(a10, "Speak", "", "Adds its own translation data to the context")        
        }  
        Container_Boundary(b2, "Page") {
            Component(a20, "Speak", "", "Adds its own translation data to the context")        
        }       
    }
```
#### QwikSpeakProvider component
`QwikSpeakProvider` component provides the Speak context to the app. `Props`:
  - `config` Speak config (required)
  - `translationFn` Optional functions to use
  - `locale` Optional locale to use
  - `langs` Optional additional languages to preload data for (multilingual)

#### Speak component (scoped translations)
`Speak` component can be used for scoped translations. `Props`:
  - `assets` Assets to load (required)
  - `runtimeAssets` Optional assets to load available at runtime
  - `langs` Optional additional languages to preload data for (multilingual)

> `QwikSpeakProvider` and `Speak` components are `Slot` components: because Qwik renders `Slot` components and direct children in isolation, translations are not immediately available in direct children

### Functions
- `$translate(keys: string | string[], params?: any, ctx?: SpeakState, lang?: string)`
Translates a key or an array of keys. The syntax of the string is `key@@[default value]`

- `$plural(value: number | string, key?: string, params?: any, options?: Intl.PluralRulesOptions, ctx?: SpeakState, lang?: string)`
Gets the plural by a number using [Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) API

- `formatDate(value: Date | number | string, options?: Intl.DateTimeFormatOptions, locale?: SpeakLocale, lang?: string, timeZone?: string)`
Formats a date using [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) API

- `relativeTime(value: number | string, unit: Intl.RelativeTimeFormatUnit, options?: Intl.RelativeTimeFormatOptions, locale?: SpeakLocale, lang?: string)`
Formats a relative time using [Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) API

- `formatNumber(value: number | string, options?: Intl.NumberFormatOptions, locale?: SpeakLocale, lang?: string, currency?: string)`
Formats a number using [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) API

## Development Builds
### Library & tools
#### Build
```shell
cd packages/qwik-speak
npm run build
```
#### Test
```shell
npm test
```
### Sample app
#### Run
```shell
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

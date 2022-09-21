# Qwik Speak ⚡️
[![Node.js CI](https://github.com/robisim74/qwik-speak/actions/workflows/node.js.yml/badge.svg)](https://github.com/robisim74/qwik-speak/actions/workflows/node.js.yml) [![Playwright](https://github.com/robisim74/qwik-speak/actions/workflows/playwright.yml/badge.svg)](https://github.com/robisim74/qwik-speak/actions/workflows/playwright.yml)

> Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps

Live example on [StackBlitz](https://stackblitz.com/edit/qwik-speak)

## Speak context
```mermaid
stateDiagram-v2
    State1: SpeakState
    State2: SpeakLocale
    State3: Translation
    State4: SpeakConfig
    State5: TranslateFn
    State1 --> State2
    State1 --> State3
    State1 --> State4
    State1 --> State5
    note right of State2
        Creates subscriptions 
        and rerenders components with translations
    end note
    note right of State3: Immutable
    note right of State4: Immutable
    note right of State5
        Immutable
        QRL functions to be serializable
    end note
```

## Usage
<!---
```mermaid
C4Container
    Container_Boundary(a, "App") {
        Component(a0, "QwikSpeak", "", "Uses Speak context")
        Container_Boundary(b1, "Home") {
            Component(a10, "Speak", "", "Adds its own translation data to the context")        
        }  
        Container_Boundary(b2, "Page") {
            Component(a20, "Speak", "", "Adds its own translation data to the context")        
        }       
    }
```
-->
![Usage](images/usage.svg)

### Getting started
```shell
npm install qwik-speak --save-dev
```
### Getting the translation
```jsx
import { $translate as t, plural as p } from 'qwik-speak';

export default component$(() => {
  return (
    <>
      <p>{t('app.title', { name: 'Qwik Speak' })}</p> {/* I'm Qwik Speak */}
      <p>{p(1, 'app.devs')}</p> {/* 1 software developer */}
    </>
  );
});
```
### Getting dates & numbers
```jsx
import { formatDate as fd, formatNumber as fn } from 'qwik-speak';

export default component$(() => {
  return (
    <>
      <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p> {/* Wednesday, July 20, 2022 at 7:09 AM */}
      <p>{fn(1000000, { style: 'currency' })}</p> {/* $1,000,000.00 */}
    </>
  );
});
```
### Configuration
```typescript
import { SpeakConfig } from 'qwik-speak';

export const config: SpeakConfig = {
  defaultLocale: { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles' },
  supportedLocales: [
    { language: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome' },
    { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles' }
  ],
  assets: [
    'app', // Shared
  ]
};
```
Assets will be loaded through the implementation of `getTranslation$` function below. You can load _json_ files or call an _endpoint_ to return a `Translation` object for each language:
```json
{
  "app": {
    "title": "I'm {{name}}",
    "devs": {
      "one": "{{value}} software developer",
      "other": "{{value}} software developers"
    }
  }
}
```
### Custom APIs
```typescript
import { $ } from '@builder.io/qwik';

export const getTranslation$: GetTranslationFn = $((lang: string, asset: string, url?: URL) => {
  /* Must contain the logic to get translation data */
  
  // E.g. Fetch translation data from json files in public dir or i18n/[lang]/[asset].json endpoint 
  let endpoint = '';
  // Absolute urls on server
  if (isServer && url) {
    endpoint = url.origin;
  }
  endpoint += `/i18n/${lang}/${asset}.json`;
  const data = await fetch(endpoint);
  return data.json();
});

export const resolveLocale$: ResolveLocaleFn = $((url?: URL) => {
  /* Must contain the logic to resolve which locale to use during SSR */
});

export const storeLocale$: StoreLocaleFn = $((locale: SpeakLocale, url?: URL) => {
  /* Must contain the logic to store the locale on Client when changes */
});

export const handleMissingTranslation$: HandleMissingTranslationFn = $((key: string, value?: string, params?: any, ctx?: SpeakState) => {
  /* Must contain the logic to handle missing values: by default returns the key */
});

export const translateFn: TranslateFn = {
  getTranslation$: getTranslation$,
  /* other functions */
};
```

Add the `QwikSpeak` component in `root.tsx`:
```jsx
import { QwikSpeak } from 'qwik-speak';

export default component$(() => {
  return (
    /**
     * Init Qwik Speak (only available in child components)
     */
    <QwikSpeak config={config} translateFn={translateFn}>
      <QwikCity>
        <Head />
        <body>
          <RouterOutlet />
        </body>
      </QwikCity>
    </QwikSpeak>
  );
});
```
### Lazy loading of translation data
Use the `Speak` component to add translation data to the context:
```jsx
import { Speak } from 'qwik-speak';

export default component$(() => {
  return (
    /**
     * Add Home translation (only available in child components)
     */
    <Speak assets={['home']}>
      <Home />
    </Speak>
  );
});
```
### Additional languages
```jsx
import { Speak } from 'qwik-speak';

export default component$(() => {
  return (
    <Speak assets={['home']} langs={['en-US']}>
      <Home />
    </Speak>
  );
});
```
The translation data of the additional languages are preloaded along with the current language. They can be used as a fallback for missing values by implementing `handleMissingTranslation$` below, or for multilingual pages.

## Production
### Using a server
Translation happens at runtime: translations are downloaded during  SSR or on client, and the lookup also happens at runtime.

### Static Site Generation (SSG)
Using SSG offered by Qwik City, translations can be inlined at build time.

What you need:
- A `lang` parameter in the root, like:
  ```
  routes
  │   
  └───[...lang]
      │   index.html 
      │
      └───page
              index.html
  ```
- Handle the localized routing in `resolveLocale$` and `storeLocale$`
- Qwik City Static Site Generation config and dynamic routes

See the [sample app](https://github.com/robisim74/qwik-speak/tree/main/src/app)

## Speak config
- `defaultLocale`
The default locale

- `supportedLocales`
Supported locales

- `assets`
An array of strings: each asset is passed to the `getTranslation$` function to obtain data according to the language

- `keySeparator`
Separator of nested keys. Default is `.`

The `SpeakLocale` object contains the `lang`, in the format `language[-script][-region]`, where:
- `language`: ISO 639 two-letter or three-letter code
- `script`: ISO 15924 four-letter script code
- `region` ISO 3166 two-letter, uppercase code

and optionally contains:
- `extension` Language with Intl extensions, in the format `language[-script][-region][-extensions]` like `en-US-u-ca-gregory-nu-latn` to format dates and numbers
- `currency` ISO 4217 three-letter code
- `timezone` From the IANA time zone database
- `units` Key value pairs of unit identifiers

## APIs
### Functions
- `$translate(keys: string | string[], params?: any, ctx?: SpeakState, lang?: string)`
Translates a key or an array of keys

- `plural(value: number | string, prefix?: string, options?: Intl.PluralRulesOptions, ctx?: SpeakState, lang?: string)`
Gets the plural by a number

- `formatDate(value: Date | number | string, options?: Intl.DateTimeFormatOptions, locale?: SpeakLocale, lang?: string, timeZone?: string)`
Formats a date

- `formatNumber(value: number | string, options?: Intl.NumberFormatOptions, locale?: SpeakLocale, lang?: string, currency?: string)`
Formats a number

- `changeLocale(newLocale: SpeakLocale, ctx: SpeakState, url?: URL)`
Changes locale at runtime: loads translation data and rerenders components that uses translations
### Speak context
- `useSpeakContext()`
Returns the Speak context

- `useSpeakLocale()`
Returns the locale in Speak context

- `useTranslation()`
Returns the translation data in Speak context

- `useSpeakConfig()`
Returns the configuration in Speak context

## Development Builds
### Build the library
```Shell
npm run build
```
### Test the library
```Shell
npm test
npm run test.e2e
```
### Run the sample app
```Shell
npm start
```
### Build the sample app
```Shell
npm run build.app
```
#### Express server
```Shell
npm run serve
```
#### Static Site Generation (SSG)
With an Express server running to provide http requests, execute in another Terminal:
```Shell
npm run ssg
```
Since the sample app implements a localized routing, the command will download the translations at compile-time and generate a single app with the localized paths and inlined translations:
```
dist
│   index.html 
│
└───page
│       index.html
│   
└───it-IT
    │   index.html 
    │
    └───page
            index.html
```
Translations are also serialized and made available at runtime.

```Shell
npm run serve.ssg
```

## What's new
> Released v0.0.12

- Removed QwikCity dependency from the library

## License
MIT

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
            Container_Boundary(b, "Layout A") {
                Component(b0, "useSpeak", "", "Uses its own Speak context")
                Container_Boundary(b1, "Home") {
                    Component(b10, "useAddSpeak", "", "Adds its own translation data")        
                }  
                Container_Boundary(b2, "Page") {
                    Component(b20, "useAddSpeak", "", "Adds its own translation data")        
                }       
            }
            Container_Boundary(c, "Layout B") {
                Component(c0, "useSpeak", "", "Uses its own Speak context")           
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
import { translate as t } from 'qwik-speak';

export default component$(() => {
    return (
        <Host>
            <h1>{t('app.title', { name: 'Qwik Speak' })}</h1> {/* I'm Qwik Speak */}
        </Host>
    );
});
```
### Configuration
```typescript
import { SpeakConfig, Translation } from 'qwik-speak';

export const appTranslation: Translation = {
    "en-US": {
        "app": {
            "title": "I'm {{name}}"
        }
    },
    "it-IT": {
        "app": {
            "title": "Io sono {{name}}"
        }
    }
};

export const config: SpeakConfig = {
    defaultLocale: { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles' },
    supportedLocales: [
        { language: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome' },
        { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles' }
    ],
    assets: [
        appTranslation
    ]
};
```

```jsx
// File: src/routes/_layout.tsx
import { useSpeak } from 'qwik-speak';

export default component$(() => {
    useSpeak(config);

    return (
        <Host>
            <Header />
            <main>
                <Slot />
            </main>
        </Host >
    );
});
```
### Getting dates & numbers
```jsx
import { formatDate as fd } from 'qwik-speak';
import { formatNumber as fn } from 'qwik-speak';

export default component$(() => {
    return (
        <Host>
            <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p> {/* Wednesday, July 20, 2022 at 7:09 AM */}
            <p>{fn(1000000, { style: 'currency' })}</p> {/* $1,000,000.00 */}
        </Host>
    );
});
```
### Add translation data to a context
```jsx
import { useAddSpeak } from 'qwik-speak';

export default component$(() => {
    useAddSpeak([homeTranslation]);

    return (
        <Host>
            ...
        </Host>
    );
});
```
### Hacking the library
```typescript
import { $ } from '@builder.io/qwik';

export const getTranslation$: GetTranslationFn = $((lang: string, asset: string | Translation) => {
    /* Must contain the logic to get translation data: by default it uses only an asset of Translation object */
});

export const resolveLocale$: ResolveLocaleFn = $(() => {
    /* Must contain the logic to resolve which locale to use during SSR */
});

export const setLocale$: SetLocaleFn = $((locale: SpeakLocale) => {
    /* Must contain the logic to set the locale on Client when changes */
});

export const handleMissingTranslation$: HandleMissingTranslationFn = $((key: string, value?: string, params?: any) => {
    /* Must contain the logic to handle missing values: by default returns the key */
});

export const translateFn: TranslateFn = {
    getTranslation$: getTranslation$,
    /* other functions */
};
```
```jsx
export default component$(() => {
    useSpeak(config, translateFn); // Use Speak with config & translation functions

    return (
        <Host>
            <Header />
            <main>
                <Slot />
            </main>
        </Host >
    );
});
```

## Speak config
- `defaultLocale`
The default locale

- `supportedLocales`
Supported locales

- `assets`
An array of string paths, or an array of _Translation_ objects: each asset is passed to the _getTranslation$_ function to obtain data according to the language

- `keySeparator`
Separator of nested keys. Default is `.`

The `SpeakLocale` object contains the `lang`, in the format `language[-script][-region]`, where:
- _language_: ISO 639 two-letter or three-letter code
- _script_: ISO 15924 four-letter script code
- _region_: ISO 3166 two-letter, uppercase code

and optionally contains:
- `extension` Language with Intl extensions, in the format `language[-script][-region][-extensions]` like `en-US-u-ca-gregory-nu-latn` to format dates and numbers
- `currency` ISO 4217 three-letter code
- `timezone` From the IANA time zone database
- `units` Key value pairs of unit identifiers

## APIs
### Hooks
- `useSpeak(config: SpeakConfig, translateFn?: TranslateFn)`
Creates a new Speak context, resolves the locale & loads translation data

- `useAddSpeak(assets: Array<string | Translation>)`
Adds translation data to a Speak context

- `useSpeakHead(title?: string, description?: string, params?: any)`
Sets html lang, and translates head title and description

### Translation
- `translate(keys: string | string[], params?: any, ctx?: SpeakState, lang?: string)`
Translates a key or an array of keys

- `formatDate(value: any, options?: Intl.DateTimeFormatOptions, locale?: SpeakLocale, lang?: string, timeZone?: string)`
Formats a date

- `formatNumber(value: any, options?: Intl.NumberFormatOptions, locale?: SpeakLocale, lang?: string, currency?: string)`
Formats a number

- `changeLocale(newLocale: SpeakLocale, ctx: SpeakState)`
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
### Server-side Rendering (SSR) and Client
```Shell
npm start
```
### Test
```Shell
npm test
npm run test.e2e
```

## Production Builds
```Shell
npm run build
```

## What's new
> Released v0.0.3

> App with localized routes

## License
MIT

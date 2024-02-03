# Translate
> The return functions of `inlineTranslate` and `inlinePlural` are parsed and replaced with translated texts in chunks sent to the browser at compile time

## inlineTranslate
`inlineTranslate` returns a functions to get the translation using key-value pairs:
```tsx
const t = inlineTranslate();

t('title@@Qwik Speak')
```
Value after `@@` is the optional default value:
```tsx
`Qwik Speak`
```

### Params interpolation
`t` function accept params as well:
```tsx
t('greeting@@Hi! I am {{name}}', { name: 'Qwik Speak' })
```
`name` param is replaced at runtime or during the inlining:
```text
Hi! I am Qwik Speak
```

### Array of keys
`t` function accepts array of keys:
```tsx
t(['value1@@Value 1', 'value2@@Value 2'])
```
and returns an array of translated values:
```tsx
["Value 1", "Value 2"]
```

### Arrays and objects as values
`t` function can get arrays and objects directly from files:
```json
{
  "array": [
    "one",
    "two",
    "three"
  ],
  "obj": {
    "one": "one",
    "two": "two"
  }
}
```
just pass to the function the type parameter:
```tsx
import type { Translation } from 'qwik-speak';

t<string[]>('array')
t<Translation>('obj')
```
You can also access by array position:
```tsx
t('array.2@@three')
```
Finally, it is possible to set arrays and objects passing a _valid stringified_ default value:
```tsx
t<string[]>('array@@["one","two","three"]')
t<Translation>('obj@@{"one":"one","two":"two"}')
```

### Html in translations
You can have Html in translations, like:
```json
{
  "description": "<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>"
}
```
but you have to use `dangerouslySetInnerHTML`:
```tsx
<p dangerouslySetInnerHTML={t('description')}></p>
```
> On the client the text is _inlined_ during build, so there are no XSS risks

## inlinePlural
`inlinePlural` returns a functions that uses [Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) API:
```tsx
const p = inlinePlural();

p(1, 'devs')
```
When you run the extraction tool, it creates the Intl API plural rules for each language:
```json
{
  "devs": {
    "one": "",
    "other": ""
  }
}
```
It is possible to set the default value passing a _valid stringified_ json, keeping in mind that the counter is optionally interpolated with the `value` parameter:
```tsx
p(1, 'devs@@{"one": "{{ value }} software developer","other": "{{ value }} software developers"}')
```
Will result in:
```json
{
  "devs": {
    "one": "{{ value }} software developer",
    "other": "{{ value }} software developers"
  }
}
```
It is rendered as:
```text
1 software developer
```

## Runtime translation
When you use a translation like this:
```tsx
const key = 'dynamic';

t(key)
```
you are using a dynamic translation. It means that it is not possible to evaluate the translation at compile time but only at runtime based on the value that the key takes on.

To instruct Qwik Speak to use dynamic translations, create a file with the values that these translations can take:

_i18n/[lang]/runtime.json_
```json
{
  "dynamic": "I'm a dynamic value"
}
```
and add the `runtime` file to `runtimeAssets` in configuration or `useSpeak` provider.

## QRL functions and lifecycle hooks
QRL functions `$` and lifecycle hooks like `useTask$` create js chunks that will be lazy loaded. So you need to re-invoke `inlineTranslate` inside them:
```tsx
const fn$ = $(() => {
  const t = inlineTranslate();
  console.log(t('title@@Qwik Speak'));
});
```

## Server translation
`inlineTranslate` and `inlinePlural` work in `component$`, _Inline components_, QRL and functions if called by the components, but they might not work in functions invoked on the server, such as `routeLoader$` and _endpoints_.

Functions like `routeLoader$` live on the server, which knows nothing about the context of the app, and depending on the case they can be invoked before the app runs. To translate on the server you need:
- make sure translations are available
- let the server know the current language of the user

`server$` function can satisfy both conditions, since the function is executed only when invoked, and accepts parameters:

```tsx
export const serverFn = server$(function (lang: string) {
  const t = inlineTranslate();

  return t('title', { name: 'Qwik Speak' }, lang);
});

export default component$(() => {
  const locale = useSpeakLocale();
  const s = useSignal('');

  useTask$(async () => {
    s.value = await serverFn(locale.lang)
  });

  return (<p>{s.value}</p>);
});
```
You can also extract the language directly into the function, through the request (cookies, params), instead of passing it as a parameter.

## Automatic key generation
If you don't want to handle the keys inside the translation functions, but only the default values, you can enable automatic key generation:
- Extraction tool: add `--autoKeys=true` to the script
- Inline Vite plugin: add `autoKeys: true` to the options

> Note. You can enable this option, even if you use the syntax `key@@[default value]`.

If you enable this option, you can pass only the default values to the translation functions:
```tsx
export default component$(() => {
  const t = inlineTranslate();
  const p = inlinePlural();

  return (
    <>
      <h1>{t('app.title@@{{name}} demo', { name: 'Qwik Speak' })}</h1>

      <h3>{t('New strings without existing keys')}</h3>
      <p class="counter">{p(
        1,
        '{"one": "{{ value }} {{ color }} zebra","other": "{{ value }} {{ color }} zebras"}',
        {
          color: t('black and white')
        }
      )}</p>
    </>
  );
});
```
If you run the extractor, you will get json files like this:
```json
{
  "app": {
    "title": "Qwik Speak demo"
  },
  "autoKey_3c909eb27a10640be9495cff142f601c": {
    "one": "{{ value }} {{ color }} zebra",
    "other": "{{ value }} {{ color }} zebras"
  },
  "autoKey_8e4c0598319b3b04541df2fc36cb6fc5": "New strings without existing keys",
  "autoKey_cbe370e60f10f92d4dd8b3e9c267b1fa": "black and white"
}
```
Then the Inline plugin will manage the self-assigned keys.

# Localize
## useFormatDate
`useFormatDate` returns a functions that uses [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) API to format dates:
```tsx
const fd = useFormatDate();

fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })
```
The second param in the signature is an Intl `DateTimeFormatOptions` object, which allows you to customize the format:
```text
Monday, March 6, 2023 at 12:20 PM
```
Optionally it uses the time zone set in `timeZone` property of the `SpeakLocale`.

## useRelativeTime
`useRelativeTime` returns a functions that uses [Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) API to format relative times:
```tsx
const rt = useRelativeTime();

rt(-1, 'second')
```
The second param in the signature is an Intl `RelativeTimeFormatUnit` string:
```text
1 second ago
```

## useFormatNumber
`useFormatNumber` returns a functions that uses [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) API to format numbers:
```tsx
const fn = useFormatNumber();

fn(1000000)
```
```text
1,000,000
```

### Currency
To format as currency, you have to set the `style` property of the second param, an Intl `NumberFormatOptions` object:
```tsx
fn(1000000, { style: 'currency' })
```
```text
$1,000,000.00
```
It uses the currency code set in `currency` property of the `SpeakLocale`.

### Unit
To format as unit, you have to set the `style` and `unit` properties of the second param:
```tsx
const locale = useSpeakLocale();
const units = locale.units!;

fn(1, { style: 'unit', unit: units['length'] })
```
```text
1 mi
```
It uses the unit set in optional `units` property of the `SpeakLocale`:
```tsx
units: { 'length': 'mile' }
```

## useDisplayName
`useDisplayName` returns a functions that uses [Intl.DisplayNames](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames) API to translate language, region, script or currency display names:
```tsx
const dn = useDisplayName();

dn('en-US', { type: 'language' })
```
```text
American English
```

> The locale used by `useFormatDate`, `useRelativeTime`, `useFormatNumber` and `useDisplayName` is primarily the `extension` property of the `SpeakLocale` if provided, otherwise the `lang` property. `extension` is the language with Intl extensions, in the format `language[-script][-region][-extensions]` like `en-US-u-ca-gregory-nu-latn`


# Multilingual
Each of the translation and localization functions accepts a different language other than the current one as its last argument:
```tsx
const t = inlineTranslate();

t('title@@Qwik Speak', undefined, 'it-IT')
```
For the translation to occur in the language passed as an argument, you need to set the additional language to `useQwikSpeak` or `useSpeak` providers:
```tsx
useQwikSpeak({ config, translationFn, langs: ['it-IT'] });
```

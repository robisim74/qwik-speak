# Translate
> All translation functions, except `$inlineTranslate`, use the Speak context internally: they must be used within the Qwik components

## $translate
The `$translate` function is responsible for translating, extracting to external files, and inlining during the build, using key-value pairs:
```tsx
$translate('home.title@@Qwik Speak')
```
- In dev mode, the function returns the default value (value after `@@`) if provided
- When extracting translations, it creates scoped translation files:

  _home.json_
  ```json
  {
    "home": {
      "title": "Qwik Speak"
    }
  }
  ```
- After extraction, it returns the value in files
- In prod mod, using _Qwik Speak Inline_ Vite plugin, `$translate` function is replaced by its translation in chunks sent to the browser:
  ```tsx
  `Qwik Speak`
  ```

### Params interpolation
`$translate` function accept params as well:
```tsx
$translate('home.greeting@@Hi! I am {{name}}', { name: 'Qwik Speak' })
```
`name` param is replaced at runtime or during the inlining:
```text
Hi! I am Qwik Speak
```

### Array of keys
`$translate` function accepts array of keys:
```tsx
$translate(['value1@@Value 1', 'value2@@Value 2'])
```
and returns an array of translated values:
```tsx
["Value 1", "Value 2"]
```

### Arrays and objects as values
It can get arrays and objects directly from files:
```json
{
  "home": {
    "array": [
      "one",
      "two",
      "three"
    ],
    "obj": {
      "one": "1",
      "two": "2"
    }
  }
}
```
just pass to the function the type parameter:
```tsx
import type { Translation } from 'qwik-speak';

$translate<string[]>('home.array')
$translate<Translation>('home.obj')
```
Finally, it is possible to set arrays and objects passing a _valid stringified_ default value:
```tsx
$translate<string[]>('home.array@@["one","two","three"]')
$translate<Translation>('home.obj@@{"one":"1","two":"2"}')
```
You can also access by array position:
```tsx
$translate('home.array.2@@three')
```
> To reduce complexity (arrays and objects are _inlined_ during build) it is recommended to use objects with _a depth not greater than 1_. For the same reason, `params` interpolation is not supported when you return an array or an object

### Components props
Avoid using `$translate` in components props, pass the already translated value instead:
```tsx
export const HomeComponent = component$(() => {
  const value = t('home.title@@Qwik Speak');

  return (
    <div>
      <ChildComponent value={value} />
    </div>
  );
});
```
or use `$inlineTranslate`.

## $inlineTranslate
The `$inlineTranslate` function has the same behavior as `$translate`, but can be used outside the `component$`, for example in _Inline components_, passing the Speak context as second argument:
```tsx
import { $inlineTranslate, useSpeakContext } from 'qwik-speak';

export const TitleComponent = (props: { ctx: SpeakState }) => {
  return <h1>{$inlineTranslate('home.title@@Qwik Speak', props.ctx)}</h1>;
};

export const Home = component$(() => {
  const ctx = useSpeakContext();

  return (
    <div>
      <TitleComponent ctx={ctx} />
    </div>
  );
});
```

## $plural
The `$plural` function uses the [Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) API:
```tsx
p(1, 'home.devs')
```
When you run the extraction tool, it creates a translation file with the Intl API plural rules for each language:
```json
{
  "home": {
    "devs": {
      "one": "",
      "other": ""
    }
  }
}
```
There is no default value for the `$plural` function, so you must add the translation in each language, keeping in mind that the counter is optionally interpolated with the `value` parameter:
```json
{
  "home": {
    "devs": {
      "one": "{{ value }} software developer",
      "other": "{{ value }} software developers"
    }
  }
}
```
It is rendered as:
```text
1 software developer
```

# Localize
> All localization functions use the Speak context internally: they must be used within the Qwik components

## formatDate
The `formatDate` function uses the [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) API:
```tsx
formatDate(Date.now(), { dateStyle: 'full', timeStyle: 'short' })
```
The second param in the signature is an Intl `DateTimeFormatOptions` object, which allows you to customize the format:
```text
Monday, March 6, 2023 at 12:20 PM
```
Optionally it uses the time zone set in `timeZone` property of the `SpeakLocale`.

## relativeTime
The `relativeTime` function uses the [Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) API:
```tsx
relativeTime(-1, 'second')
```
The second param in the signature is an Intl `RelativeTimeFormatUnit` string:
```text
1 second ago
```


## formatNumber
The `formatNumber` function uses the [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) API:
```tsx
formatNumber(1000000)
```
```text
1,000,000
```

### Currency
To format as currency, you have to set the `style` property of the second param, an Intl `NumberFormatOptions` object:
```tsx
formatNumber(1000000, { style: 'currency' })
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

formatNumber(1, { style: 'unit', unit: units['length'] })
```
```text
1 mi
```
It uses the unit set in optional `units` property of the `SpeakLocale`:
```tsx
units: { 'length': 'mile' }
```

## displayName
The `displayName` function uses the [Intl.DisplayNames](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames) API:
```tsx
displayName('en-US', { type: 'language' })
```
```text
American English
```

> The locale used by `formatDate`, `relativeTime`, `formatNumber` and `displayName` is primarily the `extension` property of the `SpeakLocale` if provided, otherwise the `lang` property. `extension` is the language with Intl extensions, in the format `language[-script][-region][-extensions]` like `en-US-u-ca-gregory-nu-latn`


# Multilingual
Each of the translation and localization functions accepts a different language other than the current one as its last argument:
```tsx
$translate('home.title@@Qwik Speak', undefined, 'it-IT')
```
For the translation to occur in the language passed as an argument, you need to pass the additional language to `QwikSpeakProvider` or `Speak` components:
```tsx
<Speak assets={['home'] langs=['it-IT']}>
  <Home />
</Speak>
```

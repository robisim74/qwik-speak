# Translate
> The return functions of `useTranslate`, `inlineTranslate` and `usePlural` are parsed and replaced with translated texts at compile time. For this reason, they expect _values_ or _identifiers_ as parameters, and no JavaScript _operators_

## useTranslate
`useTranslate` returns a functions to get the translation using key-value pairs:
```tsx
const t = useTranslate();

t('home.title@@Qwik Speak')
```
Value after `@@` is the optional default value:
```tsx
`Qwik Speak`
```

### Params interpolation
`t` function accept params as well:
```tsx
t('home.greeting@@Hi! I am {{name}}', { name: 'Qwik Speak' })
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
  "home": {
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
}
```
just pass to the function the type parameter:
```tsx
import type { Translation } from 'qwik-speak';

t<string[]>('home.array')
t<Translation>('home.obj')
```
You can also access by array position:
```tsx
t('home.array.2@@three')
```
Finally, it is possible to set arrays and objects passing a _valid stringified_ default value:
```tsx
t<string[]>('home.array@@["one","two","three"]')
t<Translation>('home.obj@@{"one":"one","two":"two"}')
```

### Html in translations
You can have Html in translations, like:
```json
{
  "home": {
    "text": "<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>"
  }
}
```
but you have to use `dangerouslySetInnerHTML`:
```tsx
<p dangerouslySetInnerHTML={t('home.text')}></p>
```
> On the client the text is _inlined_ during build, so there are no XSS risks

## component$ props
> A component can wake up independently from the parent component. If the component wakes up, it needs to be able to know its props

Prefer translating inside components rather than on props:

```tsx
export const Title = component$<TitleProps>((props) => {
  return (<h1>{props.name}</h1>)
});

export const Home = component$(() => {
  const t = useTranslate();

  const name = t('app.title');
  return (
    <Title name={name} />
  );
});
```
or
```tsx
export const Title = component$<TitleProps>((props) => {
  const t = useTranslate();

  return (<h1>{t(props.name)}</h1>)
});

export const Home = component$(() => {
  return (
    <Title name='app.title' />
  );
});
```
In the latter case, `app.title` will have to be placed in the `runtimeAssets`, as a dynamic key is passed to the `t` function.

## inlineTranslate
`inlineTranslate` function has the same behavior as the function returned by `useTranslate`, but can be used outside the `component$`, for example in _Inline components_, passing the Speak context as second argument:
```tsx
import { inlineTranslate, useSpeakContext } from 'qwik-speak';

export const TitleComponent = (props: { ctx: SpeakState }) => {
  return <h1>{inlineTranslate('home.title@@Qwik Speak', props.ctx)}</h1>;
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

## usePlural
`usePlural` returns a functions that uses [Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) API:
```tsx
const p = usePlural();

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
There is no default value for `usePlural` function, so you must add the translation in each language, keeping in mind that the counter is optionally interpolated with the `value` parameter:
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
const t = useTranslate();

t('home.title@@Qwik Speak', undefined, 'it-IT')
```
For the translation to occur in the language passed as an argument, you need to pass the additional language to `QwikSpeakProvider` or `Speak` components:
```tsx
<Speak assets={['home']} langs={['it-IT']}>
  <Home />
</Speak>
```

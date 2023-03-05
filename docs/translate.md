# Translate

The `$translate` function is responsible for translating, extracting to external files, and inlining, using key-value pairs:
```jsx
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
- After extraction, it returns the value in json files
- In prod mod, `$translate` function is replaced by its translation both in server files and in chunks sent to the browser:
  ```jsx
  `Qwik Speak`
  ```


## Params
`$translate` function accept params as well:
```jsx
$translate('home.greeting@@Hi! I am {{name}}', { name: 'Qwik Speak' })
```

`name` param is replaced at runtime:
```text
Hi! I am Qwik Speak
```


## Arrays and objects
`$translate` function accepts array of keys:
```jsx
$translate(['value1@@Value 1', 'value2@@Value 2'])
```

and returns an array of translated values:
```jsx
["Value 1", "Value 2"]
```

It can get arrays and objects directly from json files:
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
```

just pass to the function the type parameter:
```jsx
import type { Translation } from 'qwik-speak';

$translate<string[]>('home.array')
$translate<Translation>('home.obj')
```

Finally, it is possible to set arrays and objects directly as the default value:

```jsx
$translate<string[]>('home.array@@["one","two","three"]')
$translate<Translation>('home.obj@@{"one":"1","two":"2"}')
```
and access by array position:
```jsx
$translate('home.array.2@@three')
```

> Make sure you are passing a valid stringified array or object as default value
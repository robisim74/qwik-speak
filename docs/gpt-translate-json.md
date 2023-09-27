# GPT Translate JSON

> Command to automatically translate your app JSON files using OpenAI GPT Chat Completions API

```shell
npm install gpt-translate-json --save-dev
```

## Requirements
- OpenAI API key

## Usage
Add the command in `package.json`, and provide required parameters:
```json
"scripts": {
  "gpt-translate-json": "gpt-translate-json --apiKey=openai_api_key --model=gpt-3.5-turbo --maxTokens=3000 --langs=en-US,it-IT --originalLang=en-US"
}
```
Available options:
- `apiKey` OpenAI API key. Required
- `model` OpenAI Chat Completion model. Required
- `maxTokens` OpenAI model max tokens per request. Required
- `langs` All supported languages. Required
- `originalLang` Original language. Required
- `basePath` The base path. Default to `'./'`
- `assetsPath` Path to translation files: `[basePath]/[assetsPath]/[lang]/*.json`. Default to `'i18n'`
- `rules` Prompt rules. Defaults:
    - `'do not translate proper names'`
    - `'do not translate texts enclosed in double braces {{}}'`
    - `'do not translate the html tags''`
    - `'do not translate URLs'`

> Depending on the model used, requests can use up to `maxTokens` shared between prompt and completion. Keep the number of `maxTokens` lower than the maximum allowed by the model: in fact, the command splits the files into multiple requests to respect the maximum number of tokens in each request based on the English language, but depending on the target language, the number of tokens used can vary significantly

Having a file structure like this:
```
i18n/
│   
└───en-US/
        app.json
```

_i18n/en-US/app.json_
```json
{
  "app": {
    "title": "<h1>Library to translate JSON using GPT</h1>"
  }
}
```
the command:
```shell
npm run gpt-translate-json
```
will generate:
```
i18n/
│   
└───en-US/
│       app.json
└───it-IT/
│       app.json
└───.metadata/
        translated.json
        translated-langs.json
```

_i18n/it-IT/app.json_
```json
{
  "app": {
    "title": "<h1>Libreria per tradurre JSON usando GPT</h1>>"
  }
}
```

### Add translations
The file `.metadata/translated.json` contains the paths of translated values, so if you add new translations:

_i18n/en-US/app.json_
```json
{
  "app": {
    "title": "<h1>Library to translate JSON using GPT</h1>"
  },
  "about": "About us"
}
```
the command will request only the new translations, reducing tokens usage, and the files will be updated:

_i18n/it-IT/app.json_
```json
{
  "app": {
    "title": "<h1>Libreria per tradurre JSON usando GPT</h1>>"
  },
  "about": "Chi siamo"
}
```

### Add languages
The file `.metadata/translated-langs.json` contains the langs already translated, so if you add a new lang:

```json
"scripts": {
  "gpt-translate-json": "gpt-translate-json --apiKey=openai_api_key --model=gpt-3.5-turbo --maxTokens=3000 --langs=en-US,it-IT,es-ES --originalLang=en-US"
}
```
will generate:
```
i18n/
│   
└───en-US/
│       app.json
└───it-IT/
│       app.json
└───es-ES/
│       app.json
└───.metadata/
        translated.json
        translated-langs.json
```

_i18n/es-ES/app.json_
```json
{
  "app": {
    "title": "<h1>Biblioteca para traducir JSON usando GPT</h1>"
  },
  "about": "Sobre nosotros"
}
```

## Using it programmatically
Rather than using the command, you can invoke `gptTranslateJson` function:
```javascript
import { gptTranslateJson } from 'gpt-translate-json';

await gptTranslateJson({
  apiKey: 'openai_api_key',
  model: 'gpt-3.5-turbo',
  maxTokens: 3000,
  langs: ['en-US', 'it-IT'],
  originalLang: 'en-US',
  rules: [
    // your custom rules
  ]
});
```

You can find the project [here](https://github.com/robisim74/gpt-translate-json)
# Qwik Speak Extract

> Extract translations directly from the components

## Usage
### Command
#### Get the code ready
Optionally, you can use a default value for the keys. The syntax is `key@@[default value]`:
```html
<p>{t('title@@Qwik Speak'}</p>
<p>{t('greeting@@Hi! I am {{name}}', { name: 'Qwik Speak' })}</p>

```
When you use a default value, it will be used as initial value for the key in every translation.

> Note that it is not necessary to provide the default value of a key every time: it is sufficient and not mandatory to provide it once in the app

#### Naming conventions
If you use scoped translations, the first property will be used as filename:
```html
<p>{t('app.title)}</p>
<p>{t('home.greeting)}</p>
```
will generate two files for each language:
```
i18n/
│   
└───en-US/
│       app.json
│       home.json
└───it-IT/
        app.json
        home.json
```
Not scoped translations will be placed in a single file, called `app.json`

#### Configuration
Add the command in `package.json`, and provide at least the supported languages:
```json
"scripts": {
  "qwik-speak-extract": "qwik-speak-extract --supportedLangs=en-US,it-IT --assetsPath=i18n"
}
```
Available options:
- `supportedLangs` Supported langs. Required
- `basePath` The base path. Default to `'./'`
- `sourceFilesPaths` Paths to files to search for translations. Default to `'src'`
- `excludedPaths` Paths to exclude
- `assetsPath` Path to translation files: `[basePath]/[assetsPath]/[lang]/*.json`. Default to `'i18n'`
- `format` The format of the translation files. Default to `'json'`
- `filename` Filename for not scoped translations. Default is `'app'`
- `fallback` Optional function to implement a fallback strategy
- `autoKeys` Automatically handle keys for each string. Default is false
- `unusedKeys` Automatically remove unused keys from assets, except in runtime assets
- `runtimeAssets` Comma-separated list of runtime assets to preserve
- `keySeparator` Separator of nested keys. Default is `'.'`
- `keyValueSeparator` Key-value separator. Default is `'@@'`

> Note. Currently, only `json` is supported as format

#### Running
```shell
npm run qwik-speak-extract
```

#### Updating
If you add new translations in the components, or a new language, they will be merged into the existing files without losing the translations already made.

### Using it programmatically
Rather than using the command, you can invoke `qwikSpeakExtract` function:
```javascript
import { qwikSpeakExtract } from 'qwik-speak/extract';

await qwikSpeakExtract({
  supportedLangs: ['en-US', 'it-IT']
});
```

### Translations fallback
By default, the extract command uses the default value of translations as the initial value when provided.
You can extend this behavior, to complete the missing translations by taking them from another language, by implementing a custom function with this signature:

```typescript
(translation: Translation) => Translation
```
and pass the function to `fallback` option:

```typescript
await qwikSpeakExtract({
  supportedLangs: supportedLangs,
  fallback: fallback
});
```
For example, if you want to use the default language translations for missing values in other languages:
```typescript
import { qwikSpeakExtract, deepMergeMissing } from 'qwik-speak/extract';

const defaultLang = 'en-US';
const supportedLangs = ['en-US', 'it-IT', 'de-DE'];

/**
 * Fallback missing values to default lang
 */
const fallback = (translation) => {
  const defaultTranslation = translation[defaultLang];
  for (const lang of supportedLangs) {
    if (lang !== defaultLang) {
      deepMergeMissing(translation[lang], defaultTranslation);
    }
  }
  return translation;
};
```

### Automatic removal of unused keys
To remove unused keys from json files, you need to enable the option and provide a comma-separated list of runtime file names:
```json
"scripts": {
  "qwik-speak-extract": "qwik-speak-extract --supportedLangs=en-US,it-IT --unusedKeys=true --runtimeAssets=runtime"
}
```
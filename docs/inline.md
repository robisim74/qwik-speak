# Qwik Speak Inline Vite plugin

> Inline Qwik Speak `$translate` function at compile time

## Usage
In development mode, translation happens _at runtime_: translations are loaded during SSR or on client, and the lookup also happens at runtime.

Using _Qwik Speak Inline_ Vite plugin, translation happens _at compile-time_: translations are loaded and inlined during the build.

> Note. If you want to avoid using the Qwik Speak Inline Vite plugin in production, you need to move all `assets` into `runtimeAssets` (both in configuration and in `Speak` components). All files will be loaded at runtime and serialized, and translation will also take place at runtime during SSR and on client

### Build using Qwik Speak Inline Vite plugin
Translations are loaded only during SSR and inlined in chunks sent to the browser during the build.

```mermaid
sequenceDiagram
    participant Server
    participant assets
    participant Client
    Note over Client: inlined data
    Server->>assets: loadTranslation$
    activate assets
    assets-->>Server: data
    deactivate assets
    Server->>Client: SSR: no serialize data

```
#### Get the code ready
Qwik uses the `q:base` attribute to determine the base URL for loading the chunks in the browser, so you have to set it in `entry.ssr.tsx` file:
```typescript
export function extractBase({ serverData }: RenderOptions): string {
  if (!isDev && serverData?.locale) {
    return '/build/' + serverData.locale;
  } else {
    return '/build';
  }
}

export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    manifest,
    ...opts,
    // Determine the base URL for the client code
    base: extractBase,
  });
}
```
#### Configure
Add `qwikSpeakInline` Vite plugin in `vite.config.ts`:
```typescript
import { qwikSpeakInline } from 'qwik-speak/inline';

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity(),
      qwikVite(),
      qwikSpeakInline({
        basePath: './',
        assetsPath: 'i18n',
        supportedLangs: ['en-US', 'it-IT'],
        defaultLang: 'en-US'
      }),
    ],
  };
});
```
and build the app:
```shell
npm run preview
```
The browser chunks are generated one for each language:
```
dist/build/
│   
└───en-US/
│       q-*.js
└───it-IT/
        q-*.js
```
Each contains only its own translation:
```javascript
/* @__PURE__ */ pr("h2", null, null, `Translate your Qwik apps into any language`, 1, null)
```
```javascript
/* @__PURE__ */ pr("h2", null, null, `Traduci le tue app Qwik in qualsiasi lingua`, 1, null)
```

At the end of the build, in root folder a `qwik-speak-inline.log` file is generated which contains:
- Missing values
- Translations with dynamic keys
- Translations with dynamic params

> Note. Currently, only `json` files are supported as assets

### Build using Qwik Speak Inline Vite plugin & runtime
When there are translations with dynamic keys or params, you can manage them in separate files, and add them to `runtimeAssets`:
  
```typescript
export const config: SpeakConfig = {
  /* ... */
  assets: [
    'app' // Translations shared by the pages
  ],
  runtimeAssets: [
    'runtime' // Translations with dynamic keys or parameters
  ]
};
  ```

```mermaid
sequenceDiagram
    participant Server
    participant assets
    participant runtimeAssets
    participant Client
    Note over Client: inlined data 
    Note over Client: runtime data
    Server->>assets: loadTranslation$
    activate assets
    assets-->>Server: data
    deactivate assets
    Server->>runtimeAssets: loadTranslation$
    activate runtimeAssets
    runtimeAssets-->>Server: runtime data
    deactivate runtimeAssets
    Server->>Client: SSR: serialize runtime data
    Client->>runtimeAssets: loadTranslation$ in SPA mode
    activate runtimeAssets
    runtimeAssets-->>Client: runtime data
    deactivate runtimeAssets

```

Likewise, you can also create scoped runtime files for different pages and pass them to `Speak` components.

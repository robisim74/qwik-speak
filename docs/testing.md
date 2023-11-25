# Testing

> Unit test a Qwik component using Qwik Speak

To unit test a component which uses `qwik-speak`, you need to wrap it with `QwikSpeakMockProvider` component, so that it can pass the `SpeakContext` to the test component and its children.

Given the `config` object and a component to test like:

_src/routes/index.tsx_
```tsx
import { inlineTranslate, useFormatDate, useFormatNumber } from 'qwik-speak';

export default component$(() => {
  const t = inlineTranslate();

  return (
    <>
      <h1>{t('app.title@@{{name}} demo', { name: 'Qwik Speak' })}</h1>
    </>
  );
});
```

We'll have the following unit test (using _Vitest_):

_src/routes/index.spec.tsx_
```tsx
import Home from './index';

test(`[Home Component]: Should render the component`, async () => {
  const { screen, render } = await createDOM();

  await render(
    <QwikSpeakMockProvider config={config}>
      <Home />
    </QwikSpeakMockProvider>
  );

  expect(screen.outerHTML).toContain('Qwik Speak demo');
});
```

Optionally, if you need to test the translated texts in different languages, you have to provide `loadTranslation$` to ensure translations are loaded in test environment, and the locale to use:

```tsx
test(`[Home Component]: Should render translated texts in Italian`, async () => {
  const { screen, render } = await createDOM();

  await render(
    <QwikSpeakProvider config={config} translationFn={translationFn} locale={{ lang: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome' }}>
      <Home />
    </QwikSpeakProvider>
  );

  expect(screen.outerHTML).toContain('Qwik Speak dimostrazione');
});
```
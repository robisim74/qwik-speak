import { createDOM } from '@builder.io/qwik/testing';
import { component$, useSignal, useTask$, $ } from '@builder.io/qwik';
import { test, describe, expect } from 'vitest';

import { t } from '../src/inline-translate';
import { QwikSpeakMockProvider } from '../src/use-qwik-speak';
import { config, translationFnStub } from './config';

const MyComponent = () => {
  return <div id="B">{t('test')}</div>;
};

const TestComponent = component$(() => {
  const s = useSignal('');

  const test$ = $(() => {
    return t('test');
  });

  useTask$(async () => {
    s.value = await test$();
  });

  return (
    <div>
      <div id="A">{s.value}</div>
      <MyComponent />
    </div>
  );
});

describe('inlineTranslate function', async () => {
  const { screen, render } = await createDOM();

  await render(
    <QwikSpeakMockProvider config={config} translationFn={translationFnStub} locale={config.defaultLocale}>
      <TestComponent />
    </QwikSpeakMockProvider>
  );

  test('translate', () => {
    expect((screen.querySelector('#A') as HTMLDivElement).innerHTML).toContain('Test');
    expect((screen.querySelector('#B') as HTMLDivElement).innerHTML).toContain('Test');
  });
});

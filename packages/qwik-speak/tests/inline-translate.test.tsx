import { createDOM } from '@builder.io/qwik/testing';
import { component$, useSignal, useTask$, $ } from '@builder.io/qwik';
import { test, describe, expect } from 'vitest';

import { inlineTranslate as _ } from '../src/inline-translate';
import { QwikSpeakProvider } from '../src/qwik-speak-component';
import { config, translationFnStub } from './config';

const MyComponent = () => {
  return <div id="B">{_('test')}</div>;
};

const TestComponent = component$(() => {
  const s = useSignal('');

  const test$ = $(() => {
    return _('test');
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
    <QwikSpeakProvider config={config} translationFn={translationFnStub} locale={config.defaultLocale}>
      <TestComponent />
    </QwikSpeakProvider>
  );

  test('translate', () => {
    expect((screen.querySelector('#A') as HTMLDivElement).innerHTML).toContain('Test');
    expect((screen.querySelector('#B') as HTMLDivElement).innerHTML).toContain('Test');
  });
});

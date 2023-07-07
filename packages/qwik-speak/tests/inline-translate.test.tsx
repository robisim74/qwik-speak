import { createDOM } from '@builder.io/qwik/testing';
import { component$, useSignal, useTask$, $ } from '@builder.io/qwik';
import { test, describe, expect } from 'vitest';

import { inlineTranslate } from '../src/inline-translate';
import { useSpeakContext } from '../src/use-speak';
import { QwikSpeakProvider } from '../src/qwik-speak-component';
import { config, translationFnStub } from './config';
import type { SpeakState } from '../src/types';

const MyComponent = (props: { ctx: SpeakState }) => {
  return <div id="B">{inlineTranslate('test', props.ctx)}</div>;
};

const TestComponent = component$(() => {
  const ctx = useSpeakContext();

  const s = useSignal('');

  const test$ = $(() => {
    return inlineTranslate('test', ctx);
  });

  useTask$(async () => {
    s.value = await test$();
  });

  return (
    <div>
      <div id="A">{s.value}</div>
      <MyComponent ctx={ctx} />
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

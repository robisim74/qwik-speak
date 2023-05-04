import { createDOM } from '@builder.io/qwik/testing';
import { component$ } from '@builder.io/qwik';
import { test, describe, expect } from 'vitest';

import { $inlineTranslate as it } from '../inline-translate';
import { useSpeakContext } from '../use-speak';
import { QwikSpeakProvider } from '../qwik-speak-component';
import { config, translationFnStub } from './config';
import type { SpeakState } from '../types';

const MyComponent = (props: { ctx: SpeakState }) => {
  return <h1>{it('test', props.ctx)}</h1>;
};

const TestComponent = component$(() => {
  const ctx = useSpeakContext();

  return (
    <div>
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
    expect((screen.querySelector('h1') as HTMLDivElement).innerHTML).toContain('Test');
  });
});

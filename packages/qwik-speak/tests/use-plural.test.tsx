import { createDOM } from '@builder.io/qwik/testing';
import { component$ } from '@builder.io/qwik';
import { test, describe, expect } from 'vitest';

import { inlinePlural } from '../src/inline-plural';
import { QwikSpeakMockProvider } from '../src/use-qwik-speak';
import { config, translationFnStub } from './config';

const TestComponent = component$(() => {
  const p = inlinePlural();

  return (
    <div>
      <div id="A">{p(1, '', { role: 'software' })}</div>
      <div id="A1">{p(2, '', { role: 'software' })}</div>
    </div>
  );
});

describe('usePlural function', async () => {
  const { screen, render } = await createDOM();

  await render(
    <QwikSpeakMockProvider config={config} translationFn={translationFnStub} locale={config.defaultLocale}>
      <TestComponent />
    </QwikSpeakMockProvider>
  );

  test('plural', () => {
    expect((screen.querySelector('#A') as HTMLDivElement).innerHTML).toContain('One software developer');
    expect((screen.querySelector('#A1') as HTMLDivElement).innerHTML).toContain('2 software developers');
  });
});

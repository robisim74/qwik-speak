import { createDOM } from '@builder.io/qwik/testing';
import { component$ } from '@builder.io/qwik';
import { test, describe, expect } from 'vitest';

import { useDisplayName } from '../use-display-name';
import { QwikSpeakProvider } from '../qwik-speak-component';
import { config } from './config';

const TestComponent = component$(() => {
  const dn = useDisplayName();

  return (
    <div>
      <div id="A">{dn('en-US', { type: 'language' })}</div>
      <div id="A1">{dn('USD', { type: 'currency' })}</div>
    </div>
  );
});

describe('displayName function', async () => {
  const { screen, render } = await createDOM();

  await render(
    <QwikSpeakProvider config={config} locale={config.defaultLocale}>
      <TestComponent />
    </QwikSpeakProvider>
  );

  test('display', () => {
    expect((screen.querySelector('#A') as HTMLDivElement).innerHTML).toContain('American English');
    expect((screen.querySelector('#A1') as HTMLDivElement).innerHTML).toContain('US Dollar');
  });
});

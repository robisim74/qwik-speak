import { createDOM } from '@builder.io/qwik/testing';
import { test, expect } from 'vitest';
import { QwikSpeakMockProvider } from 'qwik-speak';

import Home from './index';
import { config } from '../../speak-config';
import { translationFn } from '../../speak-functions';

test(`[Home Component]: Should render translated texts`, async () => {
  const { screen, render, userEvent } = await createDOM();

  await render(
    <QwikSpeakMockProvider config={config} translationFn={translationFn} locale={config.defaultLocale}>
      <Home />
    </QwikSpeakMockProvider>
  );

  expect(screen.outerHTML).toContain('Translate your Qwik apps into any language');
  expect(screen.outerHTML).toContain('0 software developers');
  expect(screen.outerHTML).toContain('New strings without existing keys');
  expect(screen.outerHTML).toContain('0 black and white zebras');

  const counters = screen.querySelectorAll('.counter') as NodeListOf<HTMLDivElement>;
  await userEvent('#counter1', 'click');
  expect(counters[0].innerHTML).toEqual('1 software developer');
  await userEvent('#counter2', 'click');
  expect(counters[1].innerHTML).toEqual('1 black and white zebra');
});

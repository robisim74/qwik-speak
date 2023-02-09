import { createDOM } from '@builder.io/qwik/testing';
import { test, expect } from 'vitest';
import { QwikSpeakProvider } from 'qwik-speak';

import { config, translationFnStub } from '../../speak-config';
import Home from './index';

test(`[Home Component]: Should render translated texts`, async () => {
  const { screen, render, userEvent } = await createDOM();

  await render(
    <QwikSpeakProvider config={config} translationFn={translationFnStub}>
      <Home />
    </QwikSpeakProvider>
  );

  expect(screen.outerHTML).toContain('Translate your Qwik apps into any language');
  expect(screen.outerHTML).toContain('0 software developers');

  const counter = screen.querySelector('.counter') as HTMLDivElement;
  await userEvent('.btn-counter', 'click');
  expect(counter.innerHTML).toEqual('1 software developer');
});

import { createDOM } from '@builder.io/qwik/testing';
import { $ } from '@builder.io/qwik';
import { test, expect } from 'vitest';

import type { LoadTranslationFn, TranslationFn } from 'qwik-speak';
import { QwikSpeakProvider } from 'qwik-speak';

import Home from './index';
import { config } from '../../speak-config';

const loadTranslationStub$: LoadTranslationFn = $((lang: string, asset: string) =>
  JSON.parse(
    import.meta.glob('/public/i18n/**/*.json', { as: 'raw', eager: true })[
    `/public/i18n/${lang}/${asset}.json`
    ]
  )
);

const translationFnStub: TranslationFn = {
  loadTranslation$: loadTranslationStub$
};

test(`[Home Component]: Should render translated texts`, async () => {
  const { screen, render, userEvent } = await createDOM();

  await render(
    <QwikSpeakProvider config={config} translationFn={translationFnStub} locale={config.defaultLocale}>
      <Home />
    </QwikSpeakProvider>
  );

  expect(screen.outerHTML).toContain('Translate your Qwik apps into any language');
  expect(screen.outerHTML).toContain('0 software developers');

  const counter = screen.querySelector('.counter') as HTMLDivElement;
  await userEvent('.btn-counter', 'click');
  expect(counter.innerHTML).toEqual('1 software developer');
});

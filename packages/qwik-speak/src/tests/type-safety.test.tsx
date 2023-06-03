import { createDOM } from '@builder.io/qwik/testing';
import { component$ } from '@builder.io/qwik';
import { test, describe, expect } from 'vitest';

import type { Translation } from '../types';
import { useTranslate } from '../use-translate';
import { QwikSpeakProvider } from '../qwik-speak-component';
import { config, mockJson, translationFnStub } from './config';

type TestType = typeof mockJson;

const TestComponent = component$(() => {
  const t = useTranslate<TestType>();

  return (
    <div>
      <div id="A">{t('test')}</div>
      <div id="A1">{t('test@@Default')}</div>
      <div id="A2">{t('testParams', { param: 'params' })}</div>
      <div id="A3">{t(['test', 'testParams'], { param: 'params' }).map((v, i) => (<div key={i}>{v}</div>))}</div>
      <div id="A4">{t('nested.test')}</div>
      <div id="A5">{t<string[]>('nested.array', { param: 'params' }).map((v, i) =>
        (<div key={i}>{v}</div>))}
      </div>
      <div id="A6">{t('nested.array.1', { param: 'params' })}</div>
      <div id="A7">{t<Translation>('nested')['test']}</div>
      <div id="A8">{t<Translation[]>('arrayObjects', { param: 'params' }).map((o, i) =>
        (<div key={i}>{o['num']}</div>))}
      </div>
    </div>
  );
});

describe('useTranslate function', async () => {
  const { screen, render } = await createDOM();

  await render(
    <QwikSpeakProvider config={config} translationFn={translationFnStub} locale={config.defaultLocale}>
      <TestComponent />
    </QwikSpeakProvider>
  );

  test('translate', () => {
    expect((screen.querySelector('#A') as HTMLDivElement).innerHTML).toContain('Test');
  });
  test('translate with default value', () => {
    expect((screen.querySelector('#A1') as HTMLDivElement).innerHTML).toContain('Test');
  });
  test('translate with params', () => {
    expect((screen.querySelector('#A2') as HTMLDivElement).innerHTML).toContain('Test params');
  });
  test('translate with array of keys', () => {
    expect((screen.querySelector('#A3') as HTMLDivElement).innerHTML).toContain('Test');
    expect((screen.querySelector('#A3') as HTMLDivElement).innerHTML).toContain('Test params');
  });
  test('key separator', () => {
    expect((screen.querySelector('#A4') as HTMLDivElement).innerHTML).toContain('Test');
  });
  test('array', () => {
    expect((screen.querySelector('#A5') as HTMLDivElement).innerHTML).toContain('Test1 params');
    expect((screen.querySelector('#A5') as HTMLDivElement).innerHTML).toContain('Test2 params');
  });
  test('array with dot notation', () => {
    expect((screen.querySelector('#A6') as HTMLDivElement).innerHTML).toContain('Test2 params');
  });
  test('object', () => {
    expect((screen.querySelector('#A7') as HTMLDivElement).innerHTML).toContain('Test');
  });
  test('array of objects', () => {
    expect((screen.querySelector('#A8') as HTMLDivElement).innerHTML).toContain('One params');
    expect((screen.querySelector('#A8') as HTMLDivElement).innerHTML).toContain('Two params');
  });
});

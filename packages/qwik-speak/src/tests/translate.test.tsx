import { createDOM } from '@builder.io/qwik/testing';
import { component$ } from '@builder.io/qwik';
import { test, describe, expect } from 'vitest';

import type { Translation } from '../types';
import { $translate as t } from '../use-translate';
import { QwikSpeakProvider } from '../qwik-speak-component';
import { config, translationFnStub } from './config';

const TestComponent = component$(() => {
  return (
    <div>
      <div id="A">{t('test')}</div>
      <div id="A1">{t('test@@Default')}</div>
      <div id="A2">{t('testParams', { param: 'params' })}</div>
      <div id="A3">{t(['test', 'testParams'], { param: 'params' }).map((v, i) => (<div key={i}>{v}</div>))}</div>
      <div id="A4">{t('test1')}</div>
      <div id="A5">{t('nested.test')}</div>
      <div id="A6">{t('test1@@Test 1')}</div>
      <div id="A7">{t('test1@@Test {{param}}', { param: 'params' })}</div>
      <div id="A8">{t<string[]>('nested.array').map((v, i) =>
        (<div key={i}>{v}</div>))}
      </div>
      <div id="A9">{t('nested.array.1')}</div>
      <div id="A10">{t<Translation>('nested')['test']}</div>
      <div id="A11">{t<Translation[]>('arrayObjects').map((o, i) =>
        (<div key={i}>{o['num']}</div>))}
      </div>
      <div id="A12">
        {true &&
          <h2>
            {t('test')}
          </h2>
        }
      </div>
      <div id="A13">{true && t('test')}</div>
      <div id="A14" title={t('test')}></div>
    </div>
  );
});

describe('$translate function', async () => {
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
  test('missing value', () => {
    expect((screen.querySelector('#A4') as HTMLDivElement).innerHTML).toContain('test1');
  });
  test('key separator', () => {
    expect((screen.querySelector('#A5') as HTMLDivElement).innerHTML).toContain('Test');
  });
  test('key-value separator', () => {
    expect((screen.querySelector('#A6') as HTMLDivElement).innerHTML).toContain('Test 1');
  });
  test('key-value separator with params', () => {
    expect((screen.querySelector('#A7') as HTMLDivElement).innerHTML).toContain('Test params');
  });
  test('array', () => {
    expect((screen.querySelector('#A8') as HTMLDivElement).innerHTML).toContain('Test1');
    expect((screen.querySelector('#A8') as HTMLDivElement).innerHTML).toContain('Test2');
  });
  test('array with dot notation', () => {
    expect((screen.querySelector('#A9') as HTMLDivElement).innerHTML).toContain('Test2');
  });
  test('object', () => {
    expect((screen.querySelector('#A10') as HTMLDivElement).innerHTML).toContain('Test');
  });
  test('array of objects', () => {
    expect((screen.querySelector('#A11') as HTMLDivElement).innerHTML).toContain('1');
    expect((screen.querySelector('#A11') as HTMLDivElement).innerHTML).toContain('3');
  });
  test('conditional rendering', () => {
    expect((screen.querySelector('#A12') as HTMLDivElement).innerHTML).toContain('Test');
  });
  test('inline conditional rendering', () => {
    expect((screen.querySelector('#A13') as HTMLDivElement).innerHTML).toContain('Test');
  });
  test('html attributes', () => {
    expect((screen.querySelector('#A14') as HTMLDivElement).getAttribute('title')).toContain('Test');
  });
});

import { createDOM } from '@builder.io/qwik/testing';
import { component$, useSignal, $, useTask$ } from '@builder.io/qwik';
import { test, describe, expect } from 'vitest';

import type { Translation } from '../src/types';
import { inlineTranslate } from '../src/inline-translate';
import { QwikSpeakMockProvider } from '../src/use-qwik-speak';
import { config, translationFnStub } from './config';

const ChildComponent = component$((props: { value: string, value1: string }) => {
  return (
    <div>
      <div id="B">{props.value}</div>
      <div id="B1">{props.value1}</div>
    </div>
  );
});

const InlineComponent = () => {
  const t = inlineTranslate();
  return <div id="C">{t('test')}</div>;
};

const test$ = $(() => {
  const t = inlineTranslate();
  return t('test');
});

const TestComponent = component$(() => {
  const t = inlineTranslate();

  const s = useSignal('');
  const s1 = useSignal(false);

  useTask$(async () => {
    s.value = await test$();
    s1.value = true;
  });

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
      <div id="A8">{t<string[]>('nested.array', { param: 'params' }).map((v, i) =>
        (<div key={i}>{v}</div>))}
      </div>
      <div id="A9">{t('nested.array.1', { param: 'params' })}</div>
      <div id="A10">{t<Translation>('nested')['test']}</div>
      <div id="A11">{t<Translation[]>('arrayObjects', { param: 'params' }).map((o, i) =>
        (<div key={i}>{o['num']}</div>))}
      </div>
      <div id="A12">
        {s1.value &&
          <h2>
            {t('test')}
          </h2>
        }
      </div>
      <div id="A13">{s1.value && t('test')}</div>
      <div id="A14" title={t('test')}></div>
      <div id="A15">{s.value}</div>
      <ChildComponent value={s.value} value1={t('test')} />
      <InlineComponent />
    </div>
  );
});

describe('inlineTranslate function', async () => {
  const { screen, render } = await createDOM();

  await render(
    <QwikSpeakMockProvider config={config} translationFn={translationFnStub} locale={config.defaultLocale}>
      <TestComponent />
    </QwikSpeakMockProvider>
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
    expect((screen.querySelector('#A8') as HTMLDivElement).innerHTML).toContain('Test1 params');
    expect((screen.querySelector('#A8') as HTMLDivElement).innerHTML).toContain('Test2 params');
  });
  test('array with dot notation', () => {
    expect((screen.querySelector('#A9') as HTMLDivElement).innerHTML).toContain('Test2 params');
  });
  test('object', () => {
    expect((screen.querySelector('#A10') as HTMLDivElement).innerHTML).toContain('Test');
  });
  test('array of objects', () => {
    expect((screen.querySelector('#A11') as HTMLDivElement).innerHTML).toContain('One params');
    expect((screen.querySelector('#A11') as HTMLDivElement).innerHTML).toContain('Two params');
  });
  test('conditional rendering', () => {
    expect((screen.querySelector('#A12') as HTMLDivElement).innerHTML).toContain('Test');
  });
  test('inline conditional rendering', () => {
    expect((screen.querySelector('#A13') as HTMLDivElement).innerHTML).toContain('Test');
  });
  test('jsx attributes', () => {
    expect((screen.querySelector('#A14') as HTMLDivElement).getAttribute('title')).toContain('Test');
  });
  test('signal', () => {
    expect((screen.querySelector('#A15') as HTMLDivElement).innerHTML).toContain('Test');
  });
  test('component props', () => {
    expect((screen.querySelector('#B') as HTMLDivElement).innerHTML).toContain('Test');
    expect((screen.querySelector('#B1') as HTMLDivElement).innerHTML).toContain('Test');
  });
  test('inline component', () => {
    expect((screen.querySelector('#C') as HTMLDivElement).innerHTML).toContain('Test');
  });
});

describe('inlineTranslate function with different lang', async () => {
  const { screen, render } = await createDOM();

  const locale = { lang: 'it-IT' };

  await render(
    <QwikSpeakMockProvider config={config} translationFn={translationFnStub} locale={locale}>
      <TestComponent />
    </QwikSpeakMockProvider>
  );

  test('translate', () => {
    expect((screen.querySelector('#A') as HTMLDivElement).innerHTML).toContain('Prova');
  });
});

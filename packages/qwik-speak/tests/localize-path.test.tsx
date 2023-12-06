import { createDOM } from '@builder.io/qwik/testing';
import { component$ } from '@builder.io/qwik';
import { test, describe, expect } from 'vitest';

import { localizePath } from '../src/routing';
import { QwikSpeakMockProvider } from '../src/use-qwik-speak';
import { config, translationFnStub } from './config';

const TestComponent = component$(() => {
  const lp = localizePath();

  return (
    <div>
      <a id="A1" href={lp(new URL('http://localhost/'), 'it-IT')}></a>
      <a id="A2" href={lp(new URL('http://localhost/page?id=1'), 'it-IT')}></a>
      <a id="A3" href={lp(new URL('http://localhost?id=1'), 'it-IT')}></a>

      <a id="B1" href={lp(new URL('http://localhost/it-IT/'), 'en-US')}></a>
      <a id="B2" href={lp(new URL('http://localhost/it-IT/page?id=1'), 'en-US')}></a>
      <a id="B4" href={lp(new URL('http://localhost/it-IT?id=1'), 'en-US')}></a>

      <a id="C1" href={lp(new URL('http://localhost/it-IT/'), 'de-DE')}></a>
      <a id="C2" href={lp(new URL('http://localhost/it-IT/page?id=1'), 'de-DE')}></a>
      <a id="C4" href={lp(new URL('http://localhost/it-IT?id=1'), 'de-DE')}></a>

      <a id="D1" href={lp('/')}></a>
      <a id="D2" href={lp('/page')}></a>
    </div>
  );
});

describe('localizePath function', async () => {
  const { screen, render } = await createDOM();

  await render(
    <QwikSpeakMockProvider config={config} translationFn={translationFnStub} locale={config.defaultLocale}>
      <TestComponent />
    </QwikSpeakMockProvider>
  );

  test('add language', () => {
    expect((screen.querySelector('#A1') as HTMLDivElement).getAttribute('href')).toBe('http://localhost/it-IT/');
    expect((screen.querySelector('#A2') as HTMLDivElement).getAttribute('href')).toBe('http://localhost/it-IT/page?id=1');
    expect((screen.querySelector('#A3') as HTMLDivElement).getAttribute('href')).toBe('http://localhost/it-IT?id=1');
  });

  test('remove language', () => {
    expect((screen.querySelector('#B1') as HTMLDivElement).getAttribute('href')).toBe('http://localhost/');
    expect((screen.querySelector('#B2') as HTMLDivElement).getAttribute('href')).toBe('http://localhost/page?id=1');
    expect((screen.querySelector('#B4') as HTMLDivElement).getAttribute('href')).toBe('http://localhost?id=1');
  });

  test('update language', () => {
    expect((screen.querySelector('#C1') as HTMLDivElement).getAttribute('href')).toBe('http://localhost/de-DE/');
    expect((screen.querySelector('#C2') as HTMLDivElement).getAttribute('href')).toBe('http://localhost/de-DE/page?id=1');
    expect((screen.querySelector('#C4') as HTMLDivElement).getAttribute('href')).toBe('http://localhost/de-DE?id=1');
  });

  test('default language', () => {
    expect((screen.querySelector('#D1') as HTMLDivElement).getAttribute('href')).toBe('/');
    expect((screen.querySelector('#D2') as HTMLDivElement).getAttribute('href')).toBe('/page');
  });
});

describe('localizePath function with different lang', async () => {
  const { screen, render } = await createDOM();

  const locale = { lang: 'it-IT' };

  await render(
    <QwikSpeakMockProvider config={config} translationFn={translationFnStub} locale={locale}>
      <TestComponent />
    </QwikSpeakMockProvider>
  );

  test('default language', () => {
    expect((screen.querySelector('#D1') as HTMLDivElement).getAttribute('href')).toBe('/it-IT/');
    expect((screen.querySelector('#D2') as HTMLDivElement).getAttribute('href')).toBe('/it-IT/page');
  });
});

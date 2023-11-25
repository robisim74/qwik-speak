import { createDOM } from '@builder.io/qwik/testing';
import { component$ } from '@builder.io/qwik';
import { test, describe, expect } from 'vitest';

import { translatePath } from '../src/translate-path';
import { QwikSpeakMockProvider } from '../src/use-qwik-speak';
import { config, translationFnStub } from './config';

const TestComponent = component$(() => {
  const tp = translatePath();

  return (
    <div>
      <div id="A1">{tp('/page')}</div>
      <div id="A2">{tp('/it-IT/pagina')}</div>
      <div id="A3">{tp('/de-DE/seite')}</div>
      <div id="A4">{tp('page')}</div>
      <div id="A5">{tp('it-IT/pagina')}</div>
      <div id="A6">{tp('de-DE/seite')}</div>
      <div id="A7">{tp('/page/my-page-slug')}</div>
      <div id="A8">{tp('/it-IT/pagina/my-page-slug')}</div>
      <div id="A9">{tp('/de-DE/seite/my-page-slug')}</div>
      <div id="A10">{tp('/page/my-page-slug/')}</div>
      <div id="A11">{tp('/it-IT/pagina/my-page-slug/')}</div>
      <div id="A12">{tp('/de-DE/seite/my-page-slug/')}</div>

      <div id="B1">{tp('/page', 'en-US')}</div>
      <div id="B2">{tp('/it-IT/pagina', 'en-US')}</div>
      <div id="B3">{tp('/de-DE/seite', 'en-US')}</div>
      <div id="B4">{tp('page', 'en-US')}</div>
      <div id="B5">{tp('it-IT/pagina', 'en-US')}</div>
      <div id="B6">{tp('de-DE/seite', 'en-US')}</div>
      <div id="B7">{tp('/page/my-page-slug', 'en-US')}</div>
      <div id="B8">{tp('/it-IT/pagina/my-page-slug', 'en-US')}</div>
      <div id="B9">{tp('/de-DE/seite/my-page-slug', 'en-US')}</div>
      <div id="B10">{tp('/page/my-page-slug/', 'en-US')}</div>
      <div id="B11">{tp('/it-IT/pagina/my-page-slug/', 'en-US')}</div>
      <div id="B12">{tp('/de-DE/seite/my-page-slug/', 'en-US')}</div>

      <div id="C1">{tp('/page', 'it-IT')}</div>
      <div id="C2">{tp('/it-IT/pagina', 'it-IT')}</div>
      <div id="C3">{tp('/de-DE/seite', 'it-IT')}</div>
      <div id="C4">{tp('page', 'it-IT')}</div>
      <div id="C5">{tp('it-IT/pagina', 'it-IT')}</div>
      <div id="C6">{tp('de-DE/seite', 'it-IT')}</div>
      <div id="C7">{tp('/page/my-page-slug', 'it-IT')}</div>
      <div id="C8">{tp('/it-IT/pagina/my-page-slug', 'it-IT')}</div>
      <div id="C9">{tp('/de-DE/seite/my-page-slug', 'it-IT')}</div>
      <div id="C10">{tp('/page/my-page-slug/', 'it-IT')}</div>
      <div id="C11">{tp('/it-IT/pagina/my-page-slug/', 'it-IT')}</div>
      <div id="C12">{tp('/de-DE/seite/my-page-slug/', 'it-IT')}</div>

      <div id="D1">{tp('/page', 'de-DE')}</div>
      <div id="D2">{tp('/it-IT/pagina', 'de-DE')}</div>
      <div id="D3">{tp('/de-DE/seite', 'de-DE')}</div>
      <div id="D4">{tp('page', 'de-DE')}</div>
      <div id="D5">{tp('it-IT/pagina', 'de-DE')}</div>
      <div id="D6">{tp('de-DE/seite', 'de-DE')}</div>
      <div id="D7">{tp('/page/my-page-slug', 'de-DE')}</div>
      <div id="D8">{tp('/it-IT/pagina/my-page-slug', 'de-DE')}</div>
      <div id="D9">{tp('/de-DE/seite/my-page-slug', 'de-DE')}</div>
      <div id="D10">{tp('/page/my-page-slug/', 'de-DE')}</div>
      <div id="D11">{tp('/it-IT/pagina/my-page-slug/', 'de-DE')}</div>
      <div id="D12">{tp('/de-DE/seite/my-page-slug/', 'de-DE')}</div>

      <div id="E1">{tp('/other')}</div>
      <div id="E2">{tp('/other', 'en-US')}</div>
      <div id="E3">{tp('/other', 'it-IT')}</div>
      <div id="E4">{tp('/other', 'de-DE')}</div>
      <div id="E5">{tp('/other/about')}</div>
      <div id="E6">{tp('/other/about', 'en-US')}</div>
      <div id="E7">{tp('/other/about', 'it-IT')}</div>
      <div id="E8">{tp('/other/about', 'de-DE')}</div>
      <div id="E10">{tp('/other/about/', 'en-US')}</div>
      <div id="E11">{tp('/other/about/', 'it-IT')}</div>
      <div id="E12">{tp('/other/about/', 'de-DE')}</div>

      <div id="F1">{tp('/')}</div>
      <div id="F2">{tp('/', 'en-US')}</div>
      <div id="F3">{tp('/', 'it-IT')}</div>
      <div id="F4">{tp('/', 'de-DE')}</div>
      <div id="F5">{tp('/it-IT')}</div>
      <div id="F6">{tp('/it-IT', 'en-US')}</div>
      <div id="F7">{tp('/it-IT', 'it-IT')}</div>
      <div id="F8">{tp('/it-IT', 'de-DE')}</div>
      <div id="F10">{tp('/it-IT/', 'en-US')}</div>
      <div id="F11">{tp('/it-IT/', 'it-IT')}</div>
      <div id="F12">{tp('/it-IT/', 'de-DE')}</div>

    </div>
  );
});

describe('translatePath function', async () => {
  const { screen, render } = await createDOM();

  await render(
    <QwikSpeakMockProvider config={config} translationFn={translationFnStub} locale={config.defaultLocale}>
      <TestComponent />
    </QwikSpeakMockProvider>
  );

  test('translate without prefix', () => {
    expect((screen.querySelector('#A1') as HTMLDivElement).innerHTML).toBe('/page');
    expect((screen.querySelector('#A2') as HTMLDivElement).innerHTML).toBe('/page');
    expect((screen.querySelector('#A3') as HTMLDivElement).innerHTML).toBe('/page');
    expect((screen.querySelector('#A4') as HTMLDivElement).innerHTML).toBe('page');
    expect((screen.querySelector('#A5') as HTMLDivElement).innerHTML).toBe('page');
    expect((screen.querySelector('#A6') as HTMLDivElement).innerHTML).toBe('page');
    expect((screen.querySelector('#A7') as HTMLDivElement).innerHTML).toBe('/page/my-page-slug');
    expect((screen.querySelector('#A8') as HTMLDivElement).innerHTML).toBe('/page/my-page-slug');
    expect((screen.querySelector('#A9') as HTMLDivElement).innerHTML).toBe('/page/my-page-slug');
    expect((screen.querySelector('#A10') as HTMLDivElement).innerHTML).toBe('/page/my-page-slug/');
    expect((screen.querySelector('#A11') as HTMLDivElement).innerHTML).toBe('/page/my-page-slug/');
    expect((screen.querySelector('#A12') as HTMLDivElement).innerHTML).toBe('/page/my-page-slug/');
  });

  test('translate with default prefix', () => {
    expect((screen.querySelector('#B1') as HTMLDivElement).innerHTML).toBe('/page');
    expect((screen.querySelector('#B2') as HTMLDivElement).innerHTML).toBe('/page');
    expect((screen.querySelector('#B3') as HTMLDivElement).innerHTML).toBe('/page');
    expect((screen.querySelector('#B4') as HTMLDivElement).innerHTML).toBe('page');
    expect((screen.querySelector('#B5') as HTMLDivElement).innerHTML).toBe('page');
    expect((screen.querySelector('#B6') as HTMLDivElement).innerHTML).toBe('page');
    expect((screen.querySelector('#B7') as HTMLDivElement).innerHTML).toBe('/page/my-page-slug');
    expect((screen.querySelector('#B8') as HTMLDivElement).innerHTML).toBe('/page/my-page-slug');
    expect((screen.querySelector('#B9') as HTMLDivElement).innerHTML).toBe('/page/my-page-slug');
    expect((screen.querySelector('#B10') as HTMLDivElement).innerHTML).toBe('/page/my-page-slug/');
    expect((screen.querySelector('#B11') as HTMLDivElement).innerHTML).toBe('/page/my-page-slug/');
    expect((screen.querySelector('#B12') as HTMLDivElement).innerHTML).toBe('/page/my-page-slug/');
  });

  test('translate with it-IT prefix', () => {
    expect((screen.querySelector('#C1') as HTMLDivElement).innerHTML).toBe('/it-IT/pagina');
    expect((screen.querySelector('#C2') as HTMLDivElement).innerHTML).toBe('/it-IT/pagina');
    expect((screen.querySelector('#C3') as HTMLDivElement).innerHTML).toBe('/it-IT/pagina');
    expect((screen.querySelector('#C4') as HTMLDivElement).innerHTML).toBe('it-IT/pagina');
    expect((screen.querySelector('#C5') as HTMLDivElement).innerHTML).toBe('it-IT/pagina');
    expect((screen.querySelector('#C6') as HTMLDivElement).innerHTML).toBe('it-IT/pagina');
    expect((screen.querySelector('#C7') as HTMLDivElement).innerHTML).toBe('/it-IT/pagina/my-page-slug');
    expect((screen.querySelector('#C8') as HTMLDivElement).innerHTML).toBe('/it-IT/pagina/my-page-slug');
    expect((screen.querySelector('#C9') as HTMLDivElement).innerHTML).toBe('/it-IT/pagina/my-page-slug');
    expect((screen.querySelector('#C10') as HTMLDivElement).innerHTML).toBe('/it-IT/pagina/my-page-slug/');
    expect((screen.querySelector('#C11') as HTMLDivElement).innerHTML).toBe('/it-IT/pagina/my-page-slug/');
    expect((screen.querySelector('#C12') as HTMLDivElement).innerHTML).toBe('/it-IT/pagina/my-page-slug/');
  });

  test('translate with de-DE prefix', () => {
    expect((screen.querySelector('#D1') as HTMLDivElement).innerHTML).toBe('/de-DE/seite');
    expect((screen.querySelector('#D2') as HTMLDivElement).innerHTML).toBe('/de-DE/seite');
    expect((screen.querySelector('#D3') as HTMLDivElement).innerHTML).toBe('/de-DE/seite');
    expect((screen.querySelector('#D4') as HTMLDivElement).innerHTML).toBe('de-DE/seite');
    expect((screen.querySelector('#D5') as HTMLDivElement).innerHTML).toBe('de-DE/seite');
    expect((screen.querySelector('#D6') as HTMLDivElement).innerHTML).toBe('de-DE/seite');
    expect((screen.querySelector('#D7') as HTMLDivElement).innerHTML).toBe('/de-DE/seite/my-page-slug');
    expect((screen.querySelector('#D8') as HTMLDivElement).innerHTML).toBe('/de-DE/seite/my-page-slug');
    expect((screen.querySelector('#D9') as HTMLDivElement).innerHTML).toBe('/de-DE/seite/my-page-slug');
    expect((screen.querySelector('#D10') as HTMLDivElement).innerHTML).toBe('/de-DE/seite/my-page-slug/');
    expect((screen.querySelector('#D11') as HTMLDivElement).innerHTML).toBe('/de-DE/seite/my-page-slug/');
    expect((screen.querySelector('#D12') as HTMLDivElement).innerHTML).toBe('/de-DE/seite/my-page-slug/');
  });

  test('translate untranslated page', () => {
    expect((screen.querySelector('#E1') as HTMLDivElement).innerHTML).toBe('/other');
    expect((screen.querySelector('#E2') as HTMLDivElement).innerHTML).toBe('/other');
    expect((screen.querySelector('#E3') as HTMLDivElement).innerHTML).toBe('/other');
    expect((screen.querySelector('#E4') as HTMLDivElement).innerHTML).toBe('/other');
    expect((screen.querySelector('#E5') as HTMLDivElement).innerHTML).toBe('/other/about');
    expect((screen.querySelector('#E6') as HTMLDivElement).innerHTML).toBe('/other/about');
    expect((screen.querySelector('#E7') as HTMLDivElement).innerHTML).toBe('/other/about');
    expect((screen.querySelector('#E8') as HTMLDivElement).innerHTML).toBe('/other/about');
    expect((screen.querySelector('#E10') as HTMLDivElement).innerHTML).toBe('/other/about/');
    expect((screen.querySelector('#E11') as HTMLDivElement).innerHTML).toBe('/other/about/');
    expect((screen.querySelector('#E12') as HTMLDivElement).innerHTML).toBe('/other/about/');
  });

  test('translate home page', () => {
    expect((screen.querySelector('#F1') as HTMLDivElement).innerHTML).toBe('/');
    expect((screen.querySelector('#F2') as HTMLDivElement).innerHTML).toBe('/');
    expect((screen.querySelector('#F3') as HTMLDivElement).innerHTML).toBe('/it-IT/');
    expect((screen.querySelector('#F4') as HTMLDivElement).innerHTML).toBe('/de-DE/');
    expect((screen.querySelector('#F5') as HTMLDivElement).innerHTML).toBe('/');
    expect((screen.querySelector('#F6') as HTMLDivElement).innerHTML).toBe('/');
    expect((screen.querySelector('#F7') as HTMLDivElement).innerHTML).toBe('/it-IT');
    expect((screen.querySelector('#F8') as HTMLDivElement).innerHTML).toBe('/de-DE');
    expect((screen.querySelector('#F10') as HTMLDivElement).innerHTML).toBe('/');
    expect((screen.querySelector('#F11') as HTMLDivElement).innerHTML).toBe('/it-IT/');
    expect((screen.querySelector('#F12') as HTMLDivElement).innerHTML).toBe('/de-DE/');
  });
});

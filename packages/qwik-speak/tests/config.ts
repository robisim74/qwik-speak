import { $ } from '@builder.io/qwik';
import type { SpeakConfig, LoadTranslationFn, TranslationFn, RewriteRouteOption } from '../src/types';

const rewriteRoutes: RewriteRouteOption[] = [
  {
    prefix: 'it-IT',
    paths: {
      'page': 'pagina'
    }
  }, {
    prefix: 'de-DE',
    paths: {
      'page': 'seite'
    }
  }
];

export const config: SpeakConfig = {
  rewriteRoutes,
  defaultLocale: { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } },
  supportedLocales: [
    { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } },
    { lang: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome', units: { 'length': 'kilometer' } },
    { lang: 'de-DE', currency: 'EUR', timeZone: 'Europe/Rome', units: { 'length': 'kilometer' } }
  ],
  assets: ['test'],
  keySeparator: '.',
  keyValueSeparator: '@@'
};

export const mockJson = {
  'en-US': {
    test: 'Test',
    testParams: 'Test {{param}}',
    nested: {
      test: 'Test',
      array: ['Test1 {{ param }}', 'Test2 {{ param }}']
    },
    one: 'One {{ role }} developer',
    other: '{{value}} {{ role }} developers',
    arrayObjects: [
      { num: 'One {{ param }}' },
      { num: 'Two {{ param }}' }
    ]
  },
  'it-IT': {
    test: 'Prova',
    testParams: 'Prova {{param}}',
    nested: {
      test: 'Prova',
      array: ['Prova1 {{ param }}', 'Prova2 {{ param }}']
    },
    one: 'Un {{ role }} developer',
    other: '{{value}} {{ role }} developers',
    arrayObjects: [
      { num: 'Uno {{ param }}' },
      { num: 'Due {{ param }}' }
    ]
  },
};

export const loadTranslationStub$: LoadTranslationFn = $((lang: string) => {
  return (mockJson as any)[lang];
});

export const translationFnStub: TranslationFn = {
  loadTranslation$: loadTranslationStub$
};

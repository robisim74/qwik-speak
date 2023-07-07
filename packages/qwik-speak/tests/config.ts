import { $ } from '@builder.io/qwik';
import type { SpeakConfig, LoadTranslationFn, TranslationFn } from '../src/types';

export const config: SpeakConfig = {
  defaultLocale: { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } },
  supportedLocales: [
    { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } }
  ],
  assets: ['test'],
  keySeparator: '.',
  keyValueSeparator: '@@'
};

export const mockJson = {
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
};

export const loadTranslationStub$: LoadTranslationFn = $(() => {
  return mockJson;
});

export const translationFnStub: TranslationFn = {
  loadTranslation$: loadTranslationStub$
};

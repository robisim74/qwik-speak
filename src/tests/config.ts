import { $ } from '@builder.io/qwik';
import { SpeakLocale, SpeakConfig, Translation, SpeakState } from '../library/types';

const translationData: Translation = {
  'en-US': {
    test: 'Test',
    testParams: 'Test {{param}}',
    nested: {
      test: 'Test'
    }
  },
  'it-IT': {
    test: 'Prova'
  }
};

const config: SpeakConfig = {
  defaultLocale: { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } },
  supportedLocales: [
    { lang: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome', units: { 'length': 'kilometer' } },
    { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } }
  ],
  assets: [
    translationData
  ]
};

const locale: SpeakLocale = {
  lang: 'en-US',
  currency: 'USD',
  timeZone: 'America/Los_Angeles',
  units: { 'length': 'mile' }
};

export const ctx: SpeakState = new Proxy({
  locale: locale,
  translation: translationData,
  config: config,
  translateFn: {
    getTranslation$: $((lang: string, asset: string | Translation) => (<Translation>asset)[lang]),
    resolveLocale$: $(() => null),
    storeLocale$: $(() => { }),
    handleMissingTranslation$: $((key: string) => 'not found')
  }
}, {});

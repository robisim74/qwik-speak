import { server$ } from '@builder.io/qwik-city';

import type {
  LoadTranslationFn,
  SpeakConfig,
  TranslationFn
} from 'qwik-speak';

/**
 * Speak config
 */
export const config: SpeakConfig = {
  defaultLocale: { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } },
  supportedLocales: [
    { lang: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome', units: { 'length': 'kilometer' } },
    { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } }
  ],
  assets: [
    'app' // Translations shared by the pages
  ],
  runtimeAssets: [
    'runtime' // Translations with dynamic keys or parameters
  ]
};

/**
 * Translation files are imported directly as string
 */
const translationData = import.meta.glob('/public/i18n/**/*.json', { as: 'raw', eager: true });

/**
 * Using server$, translation data is always accessed on the server
 */
const loadTranslation$: LoadTranslationFn = server$((lang: string, asset: string) =>
  JSON.parse(translationData[`/public/i18n/${lang}/${asset}.json`])
);

/**
 * Translation functions
 */
export const translationFn: TranslationFn = {
  loadTranslation$: loadTranslation$
};

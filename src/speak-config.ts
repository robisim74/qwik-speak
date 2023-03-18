import { $ } from '@builder.io/qwik';
import { isDev, isServer } from '@builder.io/qwik/build';
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
 * E.g. Fetch translation data from json files
 * In productions with inlined translations, only the runtime files are loaded
 */
export const loadTranslation$: LoadTranslationFn = $(async (lang: string, asset: string, origin?: string) => {
  if (isDev || isServer || config.runtimeAssets?.includes(asset)) {
    let url = '';
    // Absolute urls on server
    if (isServer && origin) {
      url = origin;
    }
    url += `/i18n/${lang}/${asset}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return response.json();
    }
    else if (response.status === 404) {
      console.warn(`loadTranslation$: ${url} not found`);
    }
  }
});

/**
 * Translation functions
 */
export const translationFn: TranslationFn = {
  loadTranslation$: loadTranslation$
};

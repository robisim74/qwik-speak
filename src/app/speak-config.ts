import { $ } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import { RouteLocation } from '@builder.io/qwik-city';
import { SpeakConfig, SpeakLocale, SpeakState, TranslateFn, Translation } from '../library/types';
import { GetTranslationFn, ResolveLocaleFn, StoreLocaleFn, HandleMissingTranslationFn } from '../library/types';
import { getValue } from '../library/core';

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
    'app', // Shared
  ]
};

// E.g. Fetch translation data from json files in public dir or i18n/[lang]/[asset].json endpoint 
export const getTranslation$: GetTranslationFn = $(async (
  lang: string,
  asset: string,
  location?: RouteLocation
) => {
  let url = '';
  // Absolute urls on server
  if (isServer && location?.href) {
    url = new URL(location.href).origin;
  }
  url += `/i18n/${lang}/${asset}.json`;
  const data = await fetch(url);
  return data.json();
});

// E.g. Resolve locale by url during SSR
export const resolveLocale$: ResolveLocaleFn = $((location?: RouteLocation, endpointData?: any) => {
  const pathLang = location?.params?.lang;
  const lang = pathLang || config.defaultLocale.lang;
  const locale = config.supportedLocales.find(x => x.lang == lang);
  return locale;

  // E.g. Resolve locale by accept-language header
  /* const headers = endpointData?.headers;
  if (!headers?.acceptLanguage) return null;
  const lang = headers.acceptLanguage.split(';')[0].split(',')[0];
  const locale = config.supportedLocales.find(x => x.lang == lang);
  return locale; */

  // E.g. Resolve locale by cookie
  /* const headers = endpointData?.headers;
  if (!headers?.cookie) return null;
  const result = new RegExp('(?:^|; )' + encodeURIComponent('locale') + '=([^;]*)').exec(headers['cookie']);
  return result ? JSON.parse(result[1]) : null; */
});

// E.g. Store locale on Client replacing url
export const storeLocale$: StoreLocaleFn = $((locale: SpeakLocale) => {
  const url = new URL(window.location.href);
  const lang = config.supportedLocales.find(x => url.pathname.startsWith(`/${x.lang}`))?.lang;

  const regex = new RegExp(`(/${lang}/)|(/${lang}$)`);
  const segment = url.pathname.match(regex)?.[0];

  if (lang && segment) {
    let newSegment = '';
    if (locale.lang !== config.defaultLocale.lang) {
      newSegment = segment.replace(lang, locale.lang);
    } else {
      newSegment = '/';
    }
    url.pathname = url.pathname.replace(segment, newSegment);
  } else if (locale.lang !== config.defaultLocale.lang) {
    url.pathname = `/${locale.lang}${url.pathname}`;
  }

  window.history.pushState({}, '', url);

  // E.g. Store locale in cookie 
  /* document.cookie = `locale=${JSON.stringify(locale)};path=/`; */
});

// E.g. Use a fallback language for missing values
// The language must be added when QwikSpeak or Speak are used
export const handleMissingTranslation$: HandleMissingTranslationFn = $((
  key: string,
  value?: string,
  params?: any,
  ctx?: SpeakState
) => {
  value = getValue(key, ctx?.translation['en-US'], params);
  return value || key;
});

/**
 * Translation functions
 */
export const translateFn: TranslateFn = {
  getTranslation$: getTranslation$,
  resolveLocale$: resolveLocale$,
  storeLocale$: storeLocale$,
  handleMissingTranslation$: handleMissingTranslation$
};

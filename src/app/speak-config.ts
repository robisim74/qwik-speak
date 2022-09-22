import { $ } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import {
  LoadTranslationFn,
  ResolveLocaleFn,
  SpeakConfig,
  SpeakLocale,
  StoreLocaleFn,
  TranslateFn
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
    'app', // Shared
  ]
};

// E.g. Fetch translation data from json files in public dir or i18n/[lang]/[asset].json endpoint 
export const loadTranslation$: LoadTranslationFn = $(async (lang: string, asset: string, url?: URL) => {
  let endpoint = '';
  // Absolute urls on server
  if (isServer && url) {
    endpoint = url.origin;
  }
  endpoint += `/i18n/${lang}/${asset}.json`;
  const data = await fetch(endpoint);
  return data.json();
});

// E.g. Resolve locale by url during SSR
export const resolveLocale$: ResolveLocaleFn = $((url?: URL) => {
  if (url) {
    const pathLang = config.supportedLocales.find(x => url.pathname.startsWith(`/${x.lang}`))?.lang;
    const lang = pathLang || config.defaultLocale.lang;
    const locale = config.supportedLocales.find(x => x.lang == lang);
    return locale;
  }
  return null;
});

// E.g. Store locale on Client replacing url
export const storeLocale$: StoreLocaleFn = $((locale: SpeakLocale, url?: URL) => {
  if (url) {
    const pathLang = config.supportedLocales.find(x => url.pathname.startsWith(`/${x.lang}`))?.lang;

    const regex = new RegExp(`(/${pathLang}/)|(/${pathLang}$)`);
    const segment = url.pathname.match(regex)?.[0];

    if (pathLang && segment) {
      let newSegment = '';
      if (locale.lang !== config.defaultLocale.lang) {
        newSegment = segment.replace(pathLang, locale.lang);
      } else {
        newSegment = '/';
      }
      url.pathname = url.pathname.replace(segment, newSegment);
    } else if (locale.lang !== config.defaultLocale.lang) {
      url.pathname = `/${locale.lang}${url.pathname}`;
    }

    window.history.pushState({}, '', url);
  }

  // Store locale in cookie 
  document.cookie = `locale=${JSON.stringify(locale)};path=/`;
});

/**
 * Translation functions
 */
export const translateFn: TranslateFn = {
  loadTranslation$: loadTranslation$,
  resolveLocale$: resolveLocale$,
  storeLocale$: storeLocale$
};

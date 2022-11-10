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
    'app', // Translations shared by the pages
    'runtime' // Translations with dynamic keys or parameters
  ]
};

/**
 * E.g. Fetch translation data from json files in public dir or i18n/[lang]/[asset].json endpoint
 * In productions with inlined translations, only the runtime file is loaded
 */
export const loadTranslation$: LoadTranslationFn = $(async (lang: string, asset: string, url?: URL) => {
  if (import.meta.env.DEV || asset === 'runtime') {
    let endpoint = '';
    // Absolute urls on server
    if (isServer && url) {
      endpoint = url.origin;
    }
    endpoint += `/i18n/${lang}/${asset}.json`;
    const data = await fetch(endpoint);
    return data.json();
  }
});

// E.g. Resolve locale by url during SSR
export const resolveLocale$: ResolveLocaleFn = $((url?: URL) => {
  if (url) {
    const pathLang = config.supportedLocales.find(x => url.pathname.startsWith(`/${x.lang}`))?.lang;
    const lang = pathLang || config.defaultLocale.lang;
    const locale = config.supportedLocales.find(x => x.lang == lang);
    return locale;
  }
});

// E.g. Store the locale on client replacing URL
export const storeLocale$: StoreLocaleFn = $((locale: SpeakLocale) => {
  // Store locale in cookie 
  document.cookie = `locale=${JSON.stringify(locale)};path=/`;

  // Localize the route
  const url = new URL(document.location.href);
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

    // E.g. Just replace the state: no back or forward on language change
    window.history.replaceState({}, '', url);
  }
});

/**
 * Translation functions
 */
export const translateFn: TranslateFn = {
  loadTranslation$: loadTranslation$,
  resolveLocale$: resolveLocale$,
  storeLocale$: storeLocale$
};

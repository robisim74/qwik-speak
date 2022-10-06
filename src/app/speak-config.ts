import { $ } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import {
  getValue,
  HandleMissingTranslationFn,
  LoadTranslationFn,
  ResolveLocaleFn,
  SpeakConfig,
  SpeakLocale,
  SpeakState,
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
    'app', // Translations shared from the whole app
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

/**
 * E.g. Store the locale on Client
 * In productions with inlined translations, the page is reloaded
 */
export const storeLocale$: StoreLocaleFn = $((locale: SpeakLocale, url?: URL) => {
  // Store locale in cookie 
  document.cookie = `locale=${JSON.stringify(locale)};path=/`;

  if (url) {
    // Localize the route
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

    if (import.meta.env.DEV) {
      window.history.pushState({}, '', url);
    } else {
      window.location.href = url.pathname;
    }
  }
});

/**
 * E.g. Use a fallback language for missing values
 * The language must be added when QwikSpeak or Speak are used
 */
export const handleMissingTranslation$: HandleMissingTranslationFn = $((
  key: string,
  value?: string,
  params?: any,
  ctx?: SpeakState
) => {
  value = getValue(key, ctx?.translation['en-US'], params, ctx?.config.keySeparator);
  return value || key;
});

/**
 * Translation functions
 */
export const translateFn: TranslateFn = {
  loadTranslation$: loadTranslation$,
  resolveLocale$: resolveLocale$,
  storeLocale$: storeLocale$,
  handleMissingTranslation$: handleMissingTranslation$
};

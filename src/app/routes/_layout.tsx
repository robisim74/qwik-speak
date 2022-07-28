import { component$, Host, Slot, $ } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import { useLocation } from '@builder.io/qwik-city';
import { SpeakLocale, Translation } from '../../library/types';
import { GetTranslationFn, ResolveLocaleFn, SetLocaleFn, SpeakConfig, TranslateFn } from '../../library/types';
import { useSpeak } from '../../library/use-speak';

import { Header } from '../components/header/header';
import { appTranslation } from '../i18n';

export default component$(() => {
  const loc = useLocation();

  const config: SpeakConfig = {
    defaultLocale: { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } },
    supportedLocales: [
      { lang: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome', units: { 'length': 'kilometer' } },
      { lang: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } }
    ],
    assets: [
        appTranslation, // Shared
    ]
    /* assets: [
      '/public/i18n/app', // Shared
    ] */
  };

  // E.g. Fetch translation data
  const getTranslation$: GetTranslationFn = $(async (lang: string, asset: string | Translation) => {
    let url = '';
    // Absolute urls on server
    if (isServer) {
      url = new URL(loc.href).origin;
    }
    url += `${asset}-${lang}.json`;
    const data = await fetch(url);
    return data.json();
  });

  // E.g. Resolve locale by url during SSR
  const resolveLocale$: ResolveLocaleFn = $(() => {
    const lang = loc.params?.lang || config.defaultLocale.lang;
    const locale = config.supportedLocales.find(x => x.lang == lang);
    return locale;
  });

  // E.g. Set the locale on Client replacing url
  const setLocale$: SetLocaleFn = $((locale: SpeakLocale) => {
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
  });

  const translateFn: TranslateFn = {
    /* getTranslation$: getTranslation$, */
    resolveLocale$: resolveLocale$,
    setLocale$: setLocale$,
  };

  useSpeak(config, translateFn); // Speak context will be available in child components

  return (
    <Host>
      <Header />
      <main>
        <Slot />
      </main>
    </Host >
  );
});

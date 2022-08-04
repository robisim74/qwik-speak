import { $, useUserContext } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import { useLocation } from '@builder.io/qwik-city';
import { SpeakConfig, SpeakLocale, SpeakState, TranslateFn, Translation } from '../library/types';
import { GetTranslationFn, ResolveLocaleFn, SetLocaleFn, HandleMissingTranslationFn } from '../library/types';
import { getValue } from '../library/core';

import { appTranslation } from './i18n';

/**
 * Speak config
 */
export const getConfig = (): SpeakConfig => {
    return {
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
};

/**
 * Translation functions
 */
export const getTranslateFn = (): TranslateFn => {
    const loc = useLocation();
    /* const ctx = useUserContext<any>('qwikcity'); */

    const config = getConfig();

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

        // E.g. Resolve locale by by accept-language header
        /* const headers = ctx?.response?.body?.headers;
        if (!headers?.acceptLanguage) return null;
        return headers.acceptLanguage.split(';')[0].split(',')[0]; */

        // E.g. Resolve locale by cookie
        /* const headers = ctx?.response?.body?.headers;
        if (!headers?.cookie) return null;
        const result = new RegExp('(?:^|; )' + encodeURIComponent('locale') + '=([^;]*)').exec(headers['cookie']);
        return result ? JSON.parse(result[1]) : null; */
    });

    // E.g. Set locale on Client replacing url
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

        // E.g. Set locale in cookie 
        /* document.cookie = `locale=${JSON.stringify(locale)};path=/`; */
    });

    // E.g. Use a fallback language for missing values
    // The language must be added when invoking useSpeak or useAddSpeak
    const handleMissingTranslation$: HandleMissingTranslationFn = $((
        key: string,
        value?: string,
        params?: any,
        ctx?: SpeakState
    ) => {
        value = getValue(key, ctx?.translation['en-US'], params);
        return value || key;
    });

    return {
        /* getTranslation$: getTranslation$, */
        resolveLocale$: resolveLocale$,
        setLocale$: setLocale$,
        handleMissingTranslation$: handleMissingTranslation$
    };
};

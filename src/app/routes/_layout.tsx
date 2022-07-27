import { component$, Host, Slot, $, useUserContext } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import { useLocation } from '@builder.io/qwik-city';
import { GetLocaleFn, GetTranslationFn, GetUserLanguageFn, Locale, SetLocaleFn, SpeakConfig, TranslateFn, Translation } from '../../library/types';
import { useSpeak } from '../../library/use-speak';

import { Header } from '../components/header/header';
import { appTranslation } from '../i18n';

export default component$(() => {
    const loc = useLocation();
    const ctx = useUserContext<any>('qwikcity');

    const config: SpeakConfig = {
        languageFormat: 'language-region',
        defaultLocale: { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } },
        supportedLocales: [
            { language: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome', units: { 'length': 'kilometer' } },
            { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } }
        ],
        /* assets: [
            appTranslation, // Shared
        ] */
        assets: [
            '/public/i18n/app', // Shared
        ]
    };

    // Fetch translation data
    const getTranslation$: GetTranslationFn = $(async (language: string, asset: string | Translation) => {
        let url = '';
        // Absolute urls on server
        if (isServer) {
            url = new URL(loc.href).origin;
        }
        url += `${asset}-${language}.json`;
        const data = await fetch(url);
        return data.json();
    });

    // Get user language by accept-language header (on server)
    const getUserLanguage$: GetUserLanguageFn = $(() => {
        const headers = ctx?.response?.body?.headers;
        if (!headers?.acceptLanguage) return null;
        return headers.acceptLanguage.split(';')[0].split(',')[0];
    });

    // Store locale in cookie (on client)
    const setLocale$: SetLocaleFn = $((locale: Partial<Locale>) => {
        document.cookie = `locale=${JSON.stringify(locale)}`; // Session cookie
    });

    // Get locale from cookie (on server)
    const getLocale$: GetLocaleFn = $(() => {
        const headers = ctx?.response?.body?.headers;
        if (!headers?.cookie) return null;
        const result = new RegExp('(?:^|; )' + encodeURIComponent('locale') + '=([^;]*)').exec(headers['cookie']);
        return result ? JSON.parse(result[1]) : null;
    });

    const translateFn: TranslateFn = {
        getTranslation$: getTranslation$,
        getUserLanguage$: getUserLanguage$,
        setLocale$: setLocale$,
        getLocale$: getLocale$
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

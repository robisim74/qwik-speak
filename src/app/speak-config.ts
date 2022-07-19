import { $ } from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import { RouteLocation } from "@builder.io/qwik-city";
import axios from 'axios'; // Fetch can be used from nodejs 18
import { GetLocaleFn, GetTranslationFn, GetUserLanguageFn, Locale, SetLocaleFn, SpeakConfig, TranslateFn, Translation } from "../library/types";

// Default Speak config
export const getConfig = (): SpeakConfig => {
    return {
        languageFormat: 'language-region',
        defaultLocale: { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } },
        supportedLocales: [
            { language: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome', units: { 'length': 'kilometer' } },
            { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } }
        ],
        assets: [
            '/public/i18n/app' // Shared
        ]
    };
}

// Custom translate functions
export const getTranslateFn = (loc: RouteLocation, headers: any): TranslateFn => {
    // Fetch translation data
    const getTranslation$: GetTranslationFn = $(async (language: string, asset: string | Translation) => {
        let url = '';
        // Absolute urls on server
        if (isServer) {
            url = new URL(loc.href).origin;
        }
        url += `${asset}-${language}.json`;
        const response = await axios.get(url);
        return response.data;
    });

    // Get user language by accept-language header (on server)
    const getUserLanguage$: GetUserLanguageFn = $(() => {
        if (!headers?.['acceptlanguage']) return null;
        return headers['acceptlanguage'].split(';')[0].split(',')[0];
    });

    // Store locale in cookie (on client)
    const setLocale$: SetLocaleFn = $((locale: Partial<Locale>) => {
        document.cookie = `locale=${JSON.stringify(locale)}`; // Session cookie
    });

    // Get locale from cookie (on server)
    const getLocale$: GetLocaleFn = $(() => {
        if (!headers?.['cookie']) return null;
        const result = new RegExp('(?:^|; )' + encodeURIComponent('locale') + '=([^;]*)').exec(headers['cookie']);
        return result ? JSON.parse(result[1]) : null;
    });

    return {
        getTranslation$: getTranslation$,
        getUserLanguage$: getUserLanguage$,
        setLocale$: setLocale$,
        getLocale$: getLocale$
    };
}

// Get the headers (that will return in endpointResponse)
export const getHeaders = (request: any) => {
    const cookie = request.headers?.get('cookie') ?? undefined;
    const acceptLanguage = request.headers?.get('accept-language') ?? undefined;

    return {
        status: 200,
        headers: {
            cookie: cookie,
            acceptLanguage: acceptLanguage
        }
    };
}

export const getSsrEndpointResponse = (doc: any) =>
    doc?._qwikUserCtx?.qcResponse || null;

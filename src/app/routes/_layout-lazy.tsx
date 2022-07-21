import { component$, Host, Slot, useDocument } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { SpeakConfig } from '../../library/types';
import { useSpeak } from '../../library/use-speak';

import { Header } from '../components/header/header';
import { appTranslation, lazyTranslation } from '../i18n';
import { getTranslateFn } from '../utils';

export default component$(() => {
    const loc = useLocation();
    const doc = useDocument();

    /**
     * Create a new instance of config with its own assets,
     * don't modify a reference, otherwise Qwik keeps it across states
     */
    const config: SpeakConfig = {
        languageFormat: 'language-region',
        defaultLocale: { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } },
        supportedLocales: [
            { language: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome', units: { 'length': 'kilometer' } },
            { language: 'en-US', currency: 'USD', timeZone: 'America/Los_Angeles', units: { 'length': 'mile' } }
        ],
        /* assets: [
            '/public/i18n/app', // Shared
            '/public/i18n/lazy'
        ] */
        assets: [
            appTranslation, // Shared
            lazyTranslation
        ]
    };

    const translateFn = getTranslateFn(loc, doc);

    useSpeak(config, translateFn);

    return (
        <Host>
            <Header />
            <main>
                <Slot />
            </main>
        </Host >
    );
});

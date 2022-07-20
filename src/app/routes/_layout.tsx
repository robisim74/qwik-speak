import { component$, Host, Slot, $, useDocument } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { useSpeak } from '../../library/use-speak';

import { Header } from '../components/header/header';
import { getConfig, getSsrEndpointResponse, getTranslateFn } from '../speak-config';
import { homeTranslation } from '../i18n';

export default component$(() => {
    const loc = useLocation();
    const doc = useDocument();
    const endpointResponse = getSsrEndpointResponse(doc);

    // Get configuration & add assets for the home page
    const config = getConfig();
    /* config.assets.push('/public/i18n/home'); */
    config.assets.push(homeTranslation);
    const translateFn = getTranslateFn(loc, endpointResponse?.headers);

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

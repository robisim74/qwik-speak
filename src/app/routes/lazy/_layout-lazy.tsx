import { component$, Host, Slot, useDocument } from '@builder.io/qwik';
import { useLocation, } from '@builder.io/qwik-city';
import { useSpeak } from '../../../library/use-speak';

import { Header } from '../../components/header/header';
import { getConfig, getSsrEndpointResponse, getTranslateFn } from '../../speak-config';
import { lazyTranslation } from '../../i18n';

export default component$(() => {
    const loc = useLocation();
    const doc = useDocument();
    const endpointResponse = getSsrEndpointResponse(doc);

    // Get configuration & add assets for the lazy page
    const config = getConfig();
    /* config.assets.push('/public/i18n/lazy'); */
    config.assets.push(lazyTranslation);
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

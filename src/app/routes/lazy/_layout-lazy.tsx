import { component$, Host, Slot, useDocument } from '@builder.io/qwik';
import { useLocation, } from '@builder.io/qwik-city';
import { useSpeak } from '../../../library/use-speak';

import { Header } from '../../components/header/header';
import { getConfig, getTranslateFn } from '../../speak-config';

export default component$(() => {
    const location = useLocation();
    const doc = useDocument() as any;
    const endpointResponse = doc?._qwikUserCtx?.qcResponse;

    // Get configuration & add assets for the lazy page
    const config = getConfig();
    config.assets = [
        '/public/i18n/app', // Common
        '/public/i18n/lazy' // Lazy
    ]
    const translateFn = getTranslateFn(location, endpointResponse?.headers);

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

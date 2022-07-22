import { component$, Host, Slot, $, useDocument } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { useSpeak } from '../../library/use-speak';

import { Header } from '../components/header/header';
import { homeTranslation } from '../i18n';
import { getConfig, getTranslateFn } from '../speak-config';

export default component$(() => {
    const loc = useLocation();
    const doc = useDocument();

    const config = getConfig();
    /* config.assets.push(homeTranslation); */
    config.assets.push('/public/i18n/home');

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

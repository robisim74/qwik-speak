import { component$, Host, Slot, $, useDocument } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { useSpeak } from '../../library/use-speak';

import { Header } from '../components/header/header';
import { getConfig, getTranslateFn } from '../speak-config';

export default component$(() => {
    const loc = useLocation();
    const doc = useDocument();

    const config = getConfig();
    const translateFn = getTranslateFn(loc, doc);

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

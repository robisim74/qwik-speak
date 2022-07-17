import { component$, Host, Slot } from '@builder.io/qwik';

import { Header } from '../../components/header/header';

export default component$(() => {
    return (
        <Host>
            <Header />
            <main>
                <Slot />
            </main>
        </Host>
    );
});

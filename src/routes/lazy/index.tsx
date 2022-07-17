import { component$, Host } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
    return (
        <Host>

        </Host>
    );
});

export const head: DocumentHead = () => {
    return {
        title: 'Lazy',
    };
};

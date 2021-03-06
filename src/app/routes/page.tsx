import { component$, Host } from '@builder.io/qwik';
import { DocumentHead, EndpointHandler } from '@builder.io/qwik-city';
import { translate as t } from '../../library/translate';
import { useAddSpeak } from '../../library/use-add-speak';

import { getHeaders } from '../speak-config';
import { pageTranslation } from '../i18n';

export const SamplePage = component$(() => {
    return (
        <>
            <h3>{t('page.subtitle')}</h3>
        </>
    );
});

export default component$(() => {
    /* useAddSpeak([pageTranslation]); */
    useAddSpeak(['/public/i18n/page']); // Translation will be available in child components

    return (
        <Host>
            <h1>{t('app.title')}</h1>

            <SamplePage />
        </Host>
    );
});

export const onGet: EndpointHandler = ({ request }) => {
    return getHeaders(request);
};

export const head: DocumentHead = () => {
    return {
        title: 'Page'
    };
};

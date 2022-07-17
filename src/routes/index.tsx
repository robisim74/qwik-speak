import { component$, Host, useContext } from '@builder.io/qwik';
import { SpeakContext } from '../core/constants';
import { translate as t } from '../core/translate';
import { formatDate as fd } from '../core/format-date';
import { formatNumber as fn } from '../core/format-number';

export default component$(() => {
    const { locale: { currency, units } } = useContext(SpeakContext);

    return (
        <Host>
            <h1>{t('app.title')}</h1>
            <h3>{t('app.subtitle')}</h3>

            {/* Params */}
            <p>{t('app.greeting', { name: 'Qwik Speak' })}</p>
            {/* Html tags */}
            <p innerHTML={t('app.description')}></p>
            {/* Dates */}
            <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p>
            {/* Numbers */}
            <p>{fn(1000000)}</p>
            <p>{fn(1000000, { style: 'currency' })}</p>
            <p>{fn(1, { style: 'unit', unit: units!['length'] })}</p>
        </Host>
    );
});

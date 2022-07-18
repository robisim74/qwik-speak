import { component$, Host } from '@builder.io/qwik';
import { translate as t } from '../../library/translate';
import { formatDate as fd } from '../../library/format-date';
import { formatNumber as fn } from '../../library/format-number';
import { useLocale, useTranslate } from '../../library/use-functions';

export default component$(() => {
    const locale = useLocale();
    /* const { translate: t, ctx } = useTranslate(); */

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
            <p>{fn(1, { style: 'unit', unit: locale.units!['length'] })}</p>
        </Host>
    );
});

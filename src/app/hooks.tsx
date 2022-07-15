import { component$, useContext } from '@builder.io/qwik';
import { translate as t } from '../core/translate';
import { formatDate as fd } from '../core/format-date';
import { formatNumber as fn, convertNumber as cn } from '../core/format-number';
import { convertCurrency, convertLength } from './conversions';
import { SpeakContext } from '../core/constants';

/**
 * Components that use translate functions will be rerendered when locale changes
 */
export const Hooks = component$(
    () => {
        const { locale: { currency, units } } = useContext(SpeakContext);

        return (
            <div>
                {/* Params */}
                <p>{t('app.greeting', { name: 'Qwik Speak' })}</p>
                {/* Html tags */}
                <p innerHTML={t('app.description')}></p>
                {/* Dates */}
                <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p>
                {/* Numbers */}
                <p>{fn(1000000)}</p>
                <p>{cn(1000000, { style: 'currency' }, convertCurrency, { currency: currency, rate: 1.1464 })}</p>
                <p>{cn(1, { style: 'unit', unit: units!['length'] }, convertLength, { unit: units!['length'] })}</p>
            </div>
        );
    },
    {
        tagName: 'hooks',
    }
);

import { component$ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import { translate as t } from '../../../library/translate';
import { formatDate as fd } from '../../../library/format-date';
import { formatNumber as fn } from '../../../library/format-number';
import { useSpeakLocale } from '../../../library/use-functions';
import { Speak } from '../../../library/speak';

import { homeTranslation } from '../../i18n';

export const Home = component$(() => {
  const units = useSpeakLocale().units!;

  return (
    <>
      <h1>{t('app.title')}</h1>
      <h3>{t('app.subtitle')}</h3>

      {/* Params */}
      <p>{t('home.greeting', { name: 'Qwik Speak' })}</p>
      {/* Html tags */}
      <p dangerouslySetInnerHTML={t('home.text')}></p>
      {/* Dates */}
      <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p>
      {/* Numbers */}
      <p>{fn(1000000)}</p>
      <p>{fn(1000000, { style: 'currency' })}</p>
      <p>{fn(1, { style: 'unit', unit: units['length'] })}</p>
    </>
  );
});

export default component$(() => {
  return (
    /**
     * Add Home translation (only available in child components)
     */
    <Speak assets={['/public/i18n/home']}>
      <Home />
    </Speak>
  );
});

export const head: DocumentHead = {
  title: 'home.title',
  meta: [{ name: 'description', content: 'home.description' }]
};

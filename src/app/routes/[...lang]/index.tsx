import { component$ } from '@builder.io/qwik';
import { DocumentHead, StaticGenerateHandler } from '@builder.io/qwik-city';
import { translate as t } from '../../../library/translate';
import { plural as p } from '../../../library/plural';
import { formatDate as fd } from '../../../library/format-date';
import { formatNumber as fn } from '../../../library/format-number';
import { useSpeakLocale } from '../../../library/use-functions';
import { Speak } from '../../../library/speak';

import { config } from '../../speak-config';

export const Home = component$(() => {
  const units = useSpeakLocale().units!;

  return (
    <>
      <h1>{t('app.title')}</h1>
      <h3>{t('app.subtitle')}</h3>

      <h4>{t('home.params')}</h4>
      <p>{t('home.greeting', { name: 'Qwik Speak' })}</p>

      <h4>{t('home.tags')}</h4>
      <p dangerouslySetInnerHTML={t('home.text')}></p>

      <h4>{t('home.plural')}</h4>
      <p>{p(1, 'home.devs')}</p>
      <p>{p(2, 'home.devs')}</p>

      <h4>{t('home.dates')}</h4>
      <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p>

      <h4>{t('home.numbers')}</h4>
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
    <Speak assets={['home']}>
      <Home />
    </Speak>
  );
});

export const head: DocumentHead = {
  title: 'app.home.title',
  meta: [{ name: 'description', content: 'app.home.description' }]
};

export const onStaticGenerate: StaticGenerateHandler = () => {
  return {
    params: config.supportedLocales.map(locale => {
      return { lang: locale.lang !== config.defaultLocale.lang ? locale.lang : '' };
    }),
  };
};

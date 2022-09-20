import { component$ } from '@builder.io/qwik';
import { DocumentHead, StaticGenerateHandler } from '@builder.io/qwik-city';
import {
  translate as t,
  plural as p,
  formatDate as fd,
  formatNumber as fn,
  Speak,
  useSpeakLocale
} from 'qwik-speak';

import { config } from '../../speak-config';

export const Home = component$(() => {
  const units = useSpeakLocale().units!;

  return (
    <>
      <h1>{t('app.title')}</h1>
      <h2>{t('app.subtitle')}</h2>

      <h3>{t('home.params')}</h3>
      <p>{t('home.greeting', { name: 'Qwik Speak' })}</p>

      <h3>{t('home.tags')}</h3>
      <p dangerouslySetInnerHTML={t('home.text')}></p>

      <h3>{t('home.plural')}</h3>
      <p>{p(1, 'home.devs')}</p>
      <p>{p(2, 'home.devs')}</p>

      <h3>{t('home.dates')}</h3>
      <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p>

      <h3>{t('home.numbers')}</h3>
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

// E.g. SSG
export const onStaticGenerate: StaticGenerateHandler = () => {
  return {
    params: config.supportedLocales.map(locale => {
      return { lang: locale.lang !== config.defaultLocale.lang ? locale.lang : '' };
    }),
  };
};

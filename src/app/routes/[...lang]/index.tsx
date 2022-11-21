import { component$, useStore } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import {
  $translate as t,
  $plural as p,
  formatDate as fd,
  formatNumber as fn,
  relativeTime as rt,
  Speak,
  useSpeakLocale
} from 'qwik-speak';

export const Home = component$(() => {
  const units = useSpeakLocale().units!;

  const state = useStore({ count: 0 });

  return (
    <>
      <h1>{t('app.title')}</h1>
      <h2>{t('app.subtitle')}</h2>

      <h3>{t('home.params')}</h3>
      <p>{t('home.greeting', { name: 'Qwik Speak' })}</p>

      <h3>{t('home.tags')}</h3>
      <p dangerouslySetInnerHTML={t('home.text')}></p>

      <h3>{t('home.plural')}</h3>
      <button onClick$={() => state.count++}>{t('home.increment')}</button>
      <p>{p(state.count, 'runtime.devs')}</p>

      <h3>{t('home.dates')}</h3>
      <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p>
      <p>{rt(-1, 'second')}</p>

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
     * Add Home translations (only available in child components)
     */
    <Speak assets={['home']}>
      <Home />
    </Speak>
  );
});

export const head: DocumentHead = {
  title: 'runtime.head.home.title',
  meta: [{ name: 'description', content: 'runtime.head.home.description' }]
};

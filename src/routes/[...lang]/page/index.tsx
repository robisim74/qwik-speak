import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Speak, $translate as t } from 'qwik-speak';

export const Page = component$(() => {
  return (
    <>
      <h1>{t('app.title')}</h1>
      <h2>{t('app.subtitle')}</h2>

      <p>{t('page.text@@I\'m a default value')}</p>
    </>
  );
});

export default component$(() => {
  return (
    /**
     * Add Page translations (only available in child components)
     */
    <Speak assets={['page']}>
      <Page />
    </Speak>
  );
});

export const head: DocumentHead = {
  title: 'runtime.head.page.title',
  meta: [{ name: 'description', content: 'runtime.head.page.description' }]
};

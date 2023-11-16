import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Speak, t } from 'qwik-speak';

export const Page = component$(() => {
  const key = 'dynamic';

  return (
    <div class="content">
      <h1>{t('app.title')}</h1>
      <h2>{t('app.subtitle')}</h2>

      <p>{t('page.text')}</p>
      <p>{t('page.default@@I\'m a default value')}</p>
      <p>{t(`runtimePage.${key}`)}</p>
    </div>
  );
});

export default component$(() => {
  return (
    /**
     * Add Page translations (only available in child components)
     */
    <Speak assets={['page']} runtimeAssets={['runtimePage']}>
      <Page />
    </Speak>
  );
});

export const head: DocumentHead = {
  title: 'runtime.head.page.title',
  meta: [{ name: 'description', content: 'runtime.head.page.description' }]
};

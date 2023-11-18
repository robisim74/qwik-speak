import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { inlineTranslate, useSpeak } from 'qwik-speak';

export const Page = component$(() => {
  const t = inlineTranslate();

  const key = 'dynamic';

  return (
    <div class="content">
      <h1>{t('app.title')}</h1>
      <h2>{t('app.subtitle')}</h2>

      <p>{t('anotherPage')}</p>
      <p>{t('defaultValue@@I\'m a default value')}</p>
      <p>{t(`runtimePage.${key}`)}</p>
    </div>
  );
});

export default component$(() => {
  /**
   * Add scoped translations (only available in child components)
   */
  useSpeak({ runtimeAssets: ['runtimePage'] });

  return <Page />
});

export const head: DocumentHead = {
  title: 'runtime.head.page.title',
  meta: [{ name: 'description', content: 'runtime.head.page.description' }]
};

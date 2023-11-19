import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { inlineTranslate } from 'qwik-speak';

export default component$(() => {
  const t = inlineTranslate();

  const key = 'dynamic';

  return (
    <div class="content">
      <h1>{t('app.title')}</h1>
      <h2>{t('app.subtitle')}</h2>

      <p>{t('anotherPage')}</p>
      <p>{t('defaultValue@@I\'m a default value')}</p>
      <p>{t(`runtime.${key}`)}</p>
    </div>
  );
});

export const head: DocumentHead = () => {
  const t = inlineTranslate();

  return {
    title: t('app.head.page.title', { name: 'Qwik Speak' }),
    meta: [
      {
        name: 'description',
        content: t('app.head.page.description')
      }
    ],
  };
};

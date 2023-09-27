import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useLocation } from "@builder.io/qwik-city";
import { useTranslate } from 'qwik-speak';

export default component$(() => {
  const t = useTranslate();
  const loc = useLocation()

  return (
    <div class="content">
      <h1>{t('app.title')}</h1>
      <h2>{t('app.subtitle')}</h2>

      <p>{loc.params.slug}</p>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'runtime.head.page.title',
  meta: [{ name: 'description', content: 'runtime.head.page.description' }]
};

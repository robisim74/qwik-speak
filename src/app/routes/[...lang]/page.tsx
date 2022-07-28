import { component$, Host } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import { translate as t } from '../../../library/translate';
import { useAddSpeak } from '../../../library/use-add-speak';

import { pageTranslation } from '../../i18n';

export const Page = component$(() => {
  return (
    <>
      <h3>{t('page.title')}</h3>
    </>
  );
});

export default component$(() => {
  /* useAddSpeak([pageTranslation]); // Translation will be available in child components */
  useAddSpeak(['/public/i18n/page']);

  return (
    <Host>
      <h1>{t('app.title')}</h1>
      <h3>{t('app.subtitle')}</h3>

      <Page />
    </Host>
  );
});

export const head: DocumentHead = () => {
  return {
    title: 'Page'
  };
};

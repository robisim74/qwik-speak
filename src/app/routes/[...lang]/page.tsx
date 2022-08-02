import { component$, Host } from '@builder.io/qwik';
import { translate as t } from '../../../library/translate';
import { useAddSpeak } from '../../../library/use-add-speak';
import { useSpeakHead } from '../../../library/use-speak-head';

import { pageTranslation } from '../../i18n';

export const Page = component$(() => {
  useSpeakHead('page.title', 'page.description', { name: 'Qwik Speak' });

  return (
    <>
      <p>{t('page.description')}</p>
    </>
  );
});

export default component$(() => {
  useAddSpeak([pageTranslation]); // Translation will be available in child components
  /* useAddSpeak(['/public/i18n/page']); */

  return (
    <Host>
      <h1>{t('app.title')}</h1>
      <h3>{t('app.subtitle')}</h3>

      <Page />
    </Host>
  );
});

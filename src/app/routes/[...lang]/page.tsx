import { component$, Host } from '@builder.io/qwik';
import { translate as t } from '../../../library/translate';
import { useAddSpeak } from '../../../library/use-add-speak';
import { useSpeakHead } from '../../../library/use-speak-head';

import { pageTranslation } from '../../i18n';

export default component$(() => {
  /**
   * Add Page translation
   * In this example, there is an additional language that is used as a fallback for missing values 
   * by the handleMissingTranslation$ implemented during configuration
   */
  useAddSpeak([pageTranslation], ['en-US']);
  /* useAddSpeak(['/public/i18n/page']); */
  /**
   * Translate head
   */
  useSpeakHead('page.title', 'page.description', { name: 'Qwik Speak' });

  return (
    <Host>
      <h1>{t('app.title')}</h1>
      <h3>{t('app.subtitle')}</h3>

      <p>{t('page.description')}</p>
      <p>{t('page.text')}</p>
    </Host>
  );
});
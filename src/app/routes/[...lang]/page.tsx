import { component$ } from '@builder.io/qwik';
import { translate as t } from '../../../library/translate';
import { Speak } from '../../../library/speak';

import { pageTranslation } from '../../i18n';

export const Page = component$(
  () => {
    return (
      <>
        <p>{t('page.description')}</p>
        <p>{t('page.text')}</p>
      </>
    );
  },
  { tagName: 'Page' }
);

export default component$(() => {
  return (
    /**
     * Add Page translation (only available in child components)
     * In this example, there is an additional language that is used as a fallback for missing values 
     * by the handleMissingTranslation$ implemented during configuration
     */
    <Speak assets={['/public/i18n/page']} langs={['en-US']}>
      <h1>{t('app.title')}</h1>
      <h3>{t('app.subtitle')}</h3>

      <Page />
    </Speak>
  );
});

import { component$ } from '@builder.io/qwik';
import { DocumentHead, StaticGenerateHandler } from '@builder.io/qwik-city';
import { Speak, $translate as t, $inline as i } from 'qwik-speak';

import { config } from '../../../speak-config';

export const Page = component$(() => {
  return (
    <>
      <h1>{t('app.title')}</h1>
      <h2>{t('app.subtitle')}</h2>

      <p>{t("page.text@@I'm a default value")}</p>
    </>
  );
});

export default component$(() => {
  return (
    /**
     * Add Page translation (only available in child components)
     */
    <Speak assets={['page']}>
      <Page />
    </Speak>
  );
});

export const head: DocumentHead = {
  title: i('page.head.title@@Page - {{name}}', { name: 'Qwik Speak' }),
  meta: [{ name: 'description', content: i("page.head.description@@I'm another page") }]
};

// E.g. SSG
export const onStaticGenerate: StaticGenerateHandler = () => {
  return {
    params: config.supportedLocales.map(locale => {
      return { lang: locale.lang !== config.defaultLocale.lang ? locale.lang : '' };
    }),
  };
};

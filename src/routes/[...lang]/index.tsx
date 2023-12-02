import { component$, useSignal } from '@builder.io/qwik';
import type { StaticGenerateHandler, DocumentHead } from '@builder.io/qwik-city';
import {
  inlineTranslate,
  inlinePlural,
  useFormatDate,
  useFormatNumber,
  useRelativeTime,
  useSpeakLocale
} from 'qwik-speak';

import { config } from '../../speak-config';

interface TitleProps {
  name: string;
}

export const Title = component$<TitleProps>(props => {
  return (<h1>{props.name}</h1>)
});

export const SubTitle = () => {
  const t = inlineTranslate();
  return <h2>{t('app.subtitle')}</h2>;
};

export default component$(() => {
  const t = inlineTranslate();
  const p = inlinePlural();

  const fd = useFormatDate();
  const rt = useRelativeTime();
  const fn = useFormatNumber();

  const locale = useSpeakLocale();
  const units = locale.units!;

  const count = useSignal(0);

  return (
    <div class="content">
      <Title name={t('app.title')} />

      <SubTitle />

      <h3>{t('params')}</h3>
      <p>{t('greeting', { name: 'Qwik Speak' })}</p>

      <h3>{t('tags')}</h3>
      <p dangerouslySetInnerHTML={t('description')}></p>

      <h3>{t('plural')}</h3>
      <p class="counter">{p(count.value, 'devs')}</p>
      <button class="btn-counter" onClick$={() => count.value++}>{t('increment')}</button>

      <h3>{t('dates')}</h3>
      <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p>
      <p>{rt(-1, 'second')}</p>

      <h3>{t('numbers')}</h3>
      <p>{fn(1000000)}</p>
      <p>{fn(1000000, { style: 'currency' })}</p>
      <p>{fn(1, { style: 'unit', unit: units['length'] })}</p>
    </div>
  );
});

export const head: DocumentHead = () => {
  const t = inlineTranslate();

  return {
    title: t('app.head.home.title', { name: 'Qwik Speak' }),
    meta: [
      {
        name: 'description',
        content: t('app.head.home.description')
      }
    ],
  };
};

export const onStaticGenerate: StaticGenerateHandler = () => {
  return {
    params: config.supportedLocales.map(locale => {
      return { lang: locale.lang !== config.defaultLocale.lang ? locale.lang : '.' };
    })
  };
};

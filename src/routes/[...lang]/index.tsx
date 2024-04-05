import { component$, useSignal } from '@builder.io/qwik';
import type { DocumentHead, StaticGenerateHandler } from '@builder.io/qwik-city';
import {
  inlinePlural,
  inlineTranslate,
  useFormatDate,
  useFormatNumber,
  useRelativeTime,
  useSpeak,
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
  useSpeak({ assets: ['home'] });
  const t = inlineTranslate();
  const p = inlinePlural();

  const fd = useFormatDate();
  const rt = useRelativeTime();
  const fn = useFormatNumber();

  const locale = useSpeakLocale();
  const units = locale.units!;

  const count = useSignal(0);
  const zebras = useSignal(0);

  return (
    <div class="content">
      <Title name={t('app.title')} />

      <SubTitle />

      <h3>{t('params')}</h3>
      <p>{t('greeting', { name: 'Qwik Speak' })}</p>

      <h3>{t('tags')}</h3>
      <p dangerouslySetInnerHTML={t('description')}></p>

      <h3>{t('plural')}</h3>
      <p class="counter">{p(count.value, 'devs@@{"one": "{{ value }} software developer","other": "{{ value }} software developers"}')}</p>
      <button class="btn-counter" id="counter1" onClick$={() => count.value++}>{t('increment')}</button>

      <h3>{t('dates')}</h3>
      <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p>
      <p>{rt(-1, 'second')}</p>

      <h3>{t('numbers')}</h3>
      <p>{fn(1000000)}</p>
      <p>{fn(1000000, { style: 'currency' })}</p>
      <p>{fn(1, { style: 'unit', unit: units['length'] })}</p>

      {/* The following is to test autokey functionality. The strings/hashed strings as keys are not supposed to exist in json files yet */}

      <h3>{t('New strings without existing keys')}</h3>
      <p>{t('If neither key nor separator are detected in a t() function call, the key will be a hash of the string. This also works with plurals:')}</p>
      <p class="counter">{p(
        zebras.value,
        '{"one": "{{ value }} {{ color }} zebra","other": "{{ value }} {{ color }} zebras"}',
        {
          color: t('black and white')
        }
      )}</p>
      <button class="btn-counter" id="counter2" onClick$={() => zebras.value++}>{t('Add a zebra')}</button>
    </div>
  );
});

export const head: DocumentHead = () => {
  const t = inlineTranslate();

  return {
    title: t('home.head.title', { name: 'Qwik Speak' }),
    meta: [
      {
        name: 'description',
        content: t('home.head.description')
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

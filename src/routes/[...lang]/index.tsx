import { component$, useSignal } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import {
  Speak,
  inlineTranslate,
  inlinePlural,
  useFormatDate,
  useFormatNumber,
  useRelativeTime,
  useSpeakLocale
} from 'qwik-speak';

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

export const Home = component$(() => {
  const t = inlineTranslate()
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

      <h3>{t('home.params')}</h3>
      <p>{t('home.greeting', { name: 'Qwik Speak' })}</p>

      <h3>{t('home.tags')}</h3>
      <p dangerouslySetInnerHTML={t('home.text')}></p>

      <h3>{t('home.plural')}</h3>
      <p class="counter">{p(count.value, 'home.devs')}</p>
      <button class="btn-counter" onClick$={() => count.value++}>{t('home.increment')}</button>

      <h3>{t('home.dates')}</h3>
      <p>{fd(Date.now(), { dateStyle: 'full', timeStyle: 'short' })}</p>
      <p>{rt(-1, 'second')}</p>

      <h3>{t('home.numbers')}</h3>
      <p>{fn(1000000)}</p>
      <p>{fn(1000000, { style: 'currency' })}</p>
      <p>{fn(1, { style: 'unit', unit: units['length'] })}</p>
    </div>
  );
});

export default component$(() => {
  return (
    /**
     * Add Home translations (only available in child components)
     */
    <Speak assets={['home']}>
      <Home />
    </Speak>
  );
});

export const head: DocumentHead = {
  title: 'runtime.head.home.title',
  meta: [{ name: 'description', content: 'runtime.head.home.description' }]
};

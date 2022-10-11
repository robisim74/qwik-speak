import { component$ } from '@builder.io/qwik';

import { changeLocale, $translate as t, useSpeakContext } from 'qwik-speak';

export const ChangeLocale = component$(() => {
  const ctx = useSpeakContext();

  return (
    <div class="change-locale">
      <span>{t('app.changeLocale')}</span>
      {ctx.config.supportedLocales.map(locale => (
        <div class={{ active: locale.lang == ctx.locale.lang, button: true }}
          onClick$={async () => await changeLocale(locale, ctx)}>
          {locale.lang}
        </div>
      ))}
    </div>
  );
});

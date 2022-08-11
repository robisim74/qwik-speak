import { component$ } from '@builder.io/qwik';

import { changeLocale } from '../../../library/change-locale';
import { translate as t } from '../../../library/translate';
import { useSpeakContext } from '../../../library/use-functions';

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

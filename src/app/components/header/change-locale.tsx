import { component$ } from '@builder.io/qwik';

import { translate as t } from '../../../library/translate';
import { useSpeakContext, useUrl } from '../../../library/use-functions';
import { changeLocale } from '../../../library/change-locale';

export const ChangeLocale = component$(() => {
  const ctx = useSpeakContext();
  const url = useUrl();

  return (
    <div class="change-locale">
      <span>{t('app.changeLocale')}</span>
      {ctx.config.supportedLocales.map(locale => (
        <div class={{ active: locale.lang == ctx.locale.lang, button: true }}
          onClick$={async () => await changeLocale(locale, ctx, url)}>
          {locale.lang}
        </div>
      ))}
    </div>
  );
});

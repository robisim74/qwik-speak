import { component$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

import { translate as t } from '../../../library/translate';
import { useSpeakContext } from '../../../library/use-functions';
import { changeLocale } from '../../../library/change-locale';

export const ChangeLocale = component$(() => {
  const ctx = useSpeakContext();
  const location = useLocation();

  return (
    <div class="change-locale">
      <span>{t('app.changeLocale')}</span>
      {ctx.config.supportedLocales.map(locale => (
        <div class={{ active: locale.lang == ctx.locale.lang, button: true }}
          onClick$={async () => await changeLocale(locale, ctx, location)}>
          {locale.lang}
        </div>
      ))}
    </div>
  );
});

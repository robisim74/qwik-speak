import { $, component$ } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';

import { changeLocale, $translate as t, useSpeakContext, SpeakLocale } from 'qwik-speak';
import { config } from '../../speak-config';

export const ChangeLocale = component$(() => {
  const loc = useLocation();
  const nav = useNavigate();

  const ctx = useSpeakContext();

  const changeLocale$ = $(async (locale: SpeakLocale) => {
    await changeLocale(locale, ctx);

    // E.g. Store locale in cookie 
    document.cookie = `locale=${JSON.stringify(locale)};max-age=86400;path=/`;

    // E.g. Replace locale in URL
    let pathname = loc.pathname;
    if (loc.params.lang) {
      if (locale.lang !== config.defaultLocale.lang) {
        pathname = pathname.replace(loc.params.lang, locale.lang);
      } else {
        pathname = pathname.replace(new RegExp(`(/${loc.params.lang}/)|(/${loc.params.lang}$)`), '/');
      }
    } else if (locale.lang !== config.defaultLocale.lang) {
      pathname = `/${locale.lang}${pathname}`;
    }

    // No full-page reload
    nav.path = pathname;
  });

  return (
    <div class="change-locale">
      <span>{t('app.changeLocale')}</span>
      {ctx.config.supportedLocales.map(locale => (
        <div class={{ active: locale.lang == ctx.locale.lang, button: true }}
          onClick$={async () => await changeLocale$(locale)}>
          {locale.lang}
        </div>
      ))}
    </div>
  );
});

import { component$, useClientEffect$, useStyles$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { translate as t, useSpeakConfig, useSpeakLocale } from 'qwik-speak';

import { ChangeLocale } from './change-locale';

import styles from './header.css?inline';

export const Header = component$(() => {
  useStyles$(styles);

  const pathname = useLocation().pathname;
  const lang = useSpeakLocale().lang;
  const config = useSpeakConfig();

  useClientEffect$(() => {
    // Set html lang
    document.documentElement.lang = lang;
  });

  const getHref = (name: string) => {
    return lang === config.defaultLocale.lang ? name : `/${lang}${name}`
  };

  return (
    <header>
      <div class="header-inner">
        <section class="logo">
          <a href="/">Qwik Speak ⚡️</a>
        </section>
        <nav>
          <a href={getHref('/')}
            class={{ active: pathname.endsWith('/') || config.supportedLocales.some(x => pathname.endsWith(x.lang)) }}>
            {t('app.nav.home')}
          </a>
          <a href={getHref('/page')}
            class={{ active: pathname.endsWith('/page') }}>
            {t('app.nav.page')}
          </a>
        </nav>
        <ChangeLocale />
      </div>
    </header>
  );
});

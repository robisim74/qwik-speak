import { component$, useStyles$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { useSpeakConfig, useSpeakLocale, useTranslate } from 'qwik-speak';

import { ChangeLocale } from '../change-locale/change-locale';
import { SpeakLogo } from '../icons/speak';

import styles from './header.css?inline';

export const Header = component$(() => {
  useStyles$(styles);

  const t = useTranslate();

  const pathname = useLocation().url.pathname;
  const lang = useSpeakLocale().lang;
  const config = useSpeakConfig();

  const getHref = (name: string) => {
    return lang === config.defaultLocale.lang ? name : `/${lang}${name}`;
  };

  return (
    <>
      <header class="header">
        <div class="logo">
          <Link href={getHref('/')} title={t('app.title')}>
            <SpeakLogo />
          </Link>
        </div>
        <ul>
          <li>
            <Link href={getHref('/')}
              class={{ active: pathname === '/' || config.supportedLocales.some(x => pathname.endsWith(`${x.lang}/`)) }}>
              {t('app.nav.home')}
            </Link>
          </li>
          <li>
            <Link href={getHref('/page')}
              class={{ active: pathname.endsWith('/page/') }}>
              {t('app.nav.page')}
            </Link>
          </li>
        </ul>
      </header>
      <ChangeLocale />
    </>
  );
});

import { component$, useStyles$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { useSpeakConfig, useSpeakLocale, useTranslate } from 'qwik-speak';
// import { useTranslatePath } from 'qwik-speak';

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

  /** Uncomment this lines to use url rewriting to translate paths */
  // const tp = useTranslatePath();
  // const { url } = useLocation();
  // const [homePath, pagePath] = tp(['/', '/page/'])

  return (
    <>
      <header class="header">
        <div class="logo">
          {/** Uncomment this line to use url rewriting to translate paths */}
          {/* <Link href={homePath}> */}
          <Link href={getHref('/')}>
            <SpeakLogo />
          </Link>
        </div>
        <ul>
          <li>
            {/** Uncomment this line to use url rewriting to translate paths */}
            {/* <Link href={homePath} class={{ active: url.pathname === homePath }}> */}
            <Link href={getHref('/')}
              class={{ active: pathname === '/' || config.supportedLocales.some(x => pathname.endsWith(`${x.lang}/`)) }}>
              {t('app.nav.home')}
            </Link>
          </li>
          <li>
            {/** Uncomment this line to use url rewriting to translate paths */}
            {/* <Link href={pagePath} class={{ active: url.pathname === pagePath }}> */}
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

import { component$, useStyles$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { inlineTranslate, translatePath } from 'qwik-speak';

import { ChangeLocale } from '../change-locale/change-locale';
import { SpeakLogo } from '../icons/speak';

import styles from './header.css?inline';

export const Header = component$(() => {
  useStyles$(styles);

  const t = inlineTranslate();

  const pathname = useLocation().url.pathname;

  const getPath = translatePath();
  const [homePath, pagePath] = getPath(['/', '/page/']);

  return (
    <>
      <header class="header">
        <div class="logo">
          <Link href={homePath} title={t('app.title')}>
            <SpeakLogo />
          </Link>
        </div>
        <ul>
          <li>
            <Link href={homePath} class={{ active: pathname === homePath }}>
              {t('app.nav.home')}
            </Link>
          </li>
          <li>
            <Link href={pagePath} class={{ active: pathname === pagePath }}>
              {t('app.nav.page')}
            </Link>
          </li>
        </ul>
      </header>

      <ChangeLocale />
    </>
  );
});

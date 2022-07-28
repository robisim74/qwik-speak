import { component$, Host, useStyles$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { translate as t } from '../../../library/translate';
import { useSpeakConfig, useSpeakLocale } from '../../../library/use-functions';

import { ChangeLocale } from './change-locale';

import styles from './header.css?inline';

export const Header = component$(
  () => {
    useStyles$(styles);

    const pathname = useLocation().pathname;
    const lang = useSpeakLocale().lang;
    const config = useSpeakConfig();

    const getHref = (name: string) => {
      return lang === config.defaultLocale.lang ? name : `/${lang}${name}`
    };

    return (
      <Host>
        <section>
          <a href="/">Qwik Speak ⚡️</a>
        </section>
        <nav>
          <a href={getHref('/')}
            class={{ active: pathname.endsWith('/') || config.supportedLocales.some(x => pathname.endsWith(x.lang)) }}>
            {t('app.home')}
          </a>
          <a href={getHref('/page')}
            class={{ active: pathname.endsWith('/page') }}>
            {t('app.page')}
          </a>
        </nav>
        <ChangeLocale />
      </Host>
    );
  },
  {
    tagName: 'header',
  }
);

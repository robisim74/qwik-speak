import { $, component$, useStyles$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import type { SpeakLocale } from 'qwik-speak';
import { useSpeakLocale, useSpeakConfig, useDisplayName, useTranslate } from 'qwik-speak';

import styles from './change-locale.css?inline';

export const ChangeLocale = component$(() => {
  useStyles$(styles);

  const t = useTranslate();
  const dn = useDisplayName();

  const loc = useLocation();

  const locale = useSpeakLocale();
  const config = useSpeakConfig();

  // Replace the locale and navigate to the new URL
  const navigateByLocale$ = $((newLocale: SpeakLocale) => {
    const url = new URL(location.href);
    if (loc.params.lang) {
      if (newLocale.lang !== config.defaultLocale.lang) {
        url.pathname = url.pathname.replace(loc.params.lang, newLocale.lang);
      } else {
        url.pathname = url.pathname.replace(new RegExp(`(/${loc.params.lang}/)|(/${loc.params.lang}$)`), '/');
      }
    } else if (newLocale.lang !== config.defaultLocale.lang) {
      url.pathname = `/${newLocale.lang}${url.pathname}`;
    }

    location.href = url.toString();
  });

  return (
    <div class="change-locale">
      <h2>{t('app.changeLocale')}</h2>
      <div class="names">
        {config.supportedLocales.map(value => (
          <button key={value.lang} class={{ active: value.lang == locale.lang }}
            onClick$={async () => await navigateByLocale$(value)}>
            {dn(value.lang, { type: 'language' })}
          </button>
        ))}
      </div>
    </div>
  );
});

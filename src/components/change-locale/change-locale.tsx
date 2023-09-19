import { component$, useStyles$ } from '@builder.io/qwik';
import type { SpeakLocale } from 'qwik-speak';
import { useSpeakLocale, useSpeakConfig, useDisplayName, useTranslate, useTranslatePath } from 'qwik-speak';
import { useLocation } from '@builder.io/qwik-city';

import styles from './change-locale.css?inline';

export const ChangeLocale = component$(() => {
  useStyles$(styles);

  const t = useTranslate();
  const tp = useTranslatePath();
  const dn = useDisplayName();

  const loc = useLocation()
  const locale = useSpeakLocale();
  const config = useSpeakConfig();

  // Replace the locale and navigate to the new URL
  const getLocalePath = (newLocale: SpeakLocale) => {
    const url = new URL(loc.url)
    url.pathname = tp(url.pathname, newLocale.lang)
    return url.toString();
  };

  return (
    <div class="change-locale">
      <h2>{t('app.changeLocale')}</h2>
      <p>{locale.lang}</p>
      <div class="names">
        {config.supportedLocales.map(value => (
          <a key={value.lang} class={{ button: true, active: value.lang == locale.lang }} href={getLocalePath(value)}>
            {dn(value.lang, { type: 'language' })}
          </a>
        ))}
      </div>
    </div>
  );
});

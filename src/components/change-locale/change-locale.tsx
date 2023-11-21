import { component$, useStyles$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { useSpeakLocale, useSpeakConfig, useDisplayName, inlineTranslate, localizePath } from 'qwik-speak';
// import { translatePath } from 'qwik-speak';

import styles from './change-locale.css?inline';

export const ChangeLocale = component$(() => {
  useStyles$(styles);

  const t = inlineTranslate();

  const url = useLocation().url;

  const locale = useSpeakLocale();
  const config = useSpeakConfig();
  const dn = useDisplayName();

  /** Uncomment this line to use url rewriting to translate paths */
  // const getPath = translatePath();
  const getPath = localizePath();

  return (
    <div class="change-locale">
      <h2>{t('app.changeLocale')}</h2>
      <div class="names">
        {config.supportedLocales.map(value => (
          <a key={value.lang} class={{ button: true, active: value.lang == locale.lang }} href={getPath(url, value.lang)}>
            {dn(value.lang, { type: 'language' })}
          </a>
        ))}
      </div>
    </div>
  );
});

import { component$, Host } from '@builder.io/qwik';

import { translate as t } from '../../../library/translate';
import { useChangeLocale, useSpeakConfig } from '../../../library/use-functions';

export const ChangeLocale = component$(
  () => {
    const { changeLocale$, ctx } = useChangeLocale();
    const config = useSpeakConfig();

    return (
      <Host>
        <span>{t('app.changeLocale')}</span>
        {config.supportedLocales.map((locale) => (
          <div class={{ active: locale.lang == ctx.locale.lang, button: true }}
            onClick$={async () => await changeLocale$(locale, ctx)}>
            {locale.lang}
          </div>
        ))}
      </Host>
    );
  },
  {
    tagName: 'change-locale',
  }
);

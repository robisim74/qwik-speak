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
                    <div class={{ active: locale.language == ctx.locale.language, button: true }} onClick$={async () => await changeLocale$(locale, ctx)}>
                        {locale.language}
                    </div>
                ))}
            </Host>
        );
    },
    {
        tagName: 'change-locale',
    }
);

import { component$, Host, useContext, mutable } from '@builder.io/qwik';
import { changeLocale } from '../../core/change-locale';
import { SpeakContext } from '../../core/constants';
import { Locale, SpeakState } from '../../core/types';
import { translate as t } from '../../core/translate';

export const ChangeLocale = component$(
    () => {
        const speakContext = useContext(SpeakContext);
        const { config: { supportedLocales } } = speakContext;

        return (
            <Host>
                <span>{t('app.changeLocale')}</span>
                {supportedLocales.map((locale: Locale) => (
                    <ChangeLocaleButton locale={mutable(locale)} context={speakContext} />
                ))}
            </Host>
        );
    },
    {
        tagName: 'change-locale',
    }
);

export const ChangeLocaleButton = component$((props: { locale: Locale, context: SpeakState }) => {
    return (
        <div class={{ active: props.locale.language == props.context.locale.language, button: true }} onClick$={async () => await changeLocale(props.locale, props.context)}>
            {props.locale.language}
        </div>
    )
});

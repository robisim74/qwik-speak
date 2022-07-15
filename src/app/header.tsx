import { component$, useContext } from '@builder.io/qwik';
import { SpeakContext } from '../core/constants';
import { translate as t } from '../core/translate';
import { changeLocale } from '../core/change-locale';
import { Locale, SpeakState } from '../core/types';

export const Header = component$(
    () => {
        const speakContext = useContext(SpeakContext);
        const { config: { supportedLocales } } = speakContext;

        return (
            <div>
                <h1>{t('app.title')}</h1>
                <h3>{t('app.subtitle')}</h3>

                <strong>{t('app.changeLocale')}</strong>
                <br />
                <br />
                <div style="display:flex">
                    {supportedLocales.map((locale: Locale) => (
                        <ChangeLocaleButton locale={locale} context={speakContext} />
                    ))}
                </div>
                <br />
            </div>
        );
    },
    {
        tagName: 'header',
    }
);

export const ChangeLocaleButton = component$((props: { locale: Locale, context: SpeakState }) => {
    return (
        <button onClick$={async () => await changeLocale(props.locale, props.context)} style="cursor: pointer; margin-right: 0.5em;">
            {props.locale.language}
        </button>
    )
});

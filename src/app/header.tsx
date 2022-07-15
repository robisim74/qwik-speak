import { component$, useContext } from '@builder.io/qwik';
import { SpeakContext } from '../core/constants';
import { translate as t } from '../core/translate';
import { changeLocale } from '../core/change-locale';

export const Header = component$(
    () => {
        const speakContext = useContext(SpeakContext);

        return (
            <div>
                <h1>{t('app.title')}</h1>
                <h3>{t('app.subtitle')}</h3>

                <p>{t('app.changeLocale')}</p>
                <button onClick$={async () => await changeLocale({ language: 'it-IT' }, speakContext)} style="cursor: pointer">
                    it
                </button>
                <br />
                <button onClick$={async () => await changeLocale({ language: 'en-US' }, speakContext)} style="cursor: pointer">
                    en
                </button>
            </div>
        );
    },
    {
        tagName: 'header',
    }
);

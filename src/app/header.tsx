import { component$, useContext } from '@builder.io/qwik';
import { TranslateContext } from '../core/constants';
import { translate as t } from '../core/translate';
import { changeLocale } from '../core/change-locale';

export const Header = component$(
    () => {
        const translateContext = useContext(TranslateContext);

        return (
            <div>
                <h1>{t('title')}</h1>
                <p>{t('changeLocale')}</p>
                <button onClick$={async () => await changeLocale({ language: 'it-IT' }, translateContext)} style="cursor: pointer">
                    it
                </button>
                <br />
                <button onClick$={async () => await changeLocale({ language: 'en-US' }, translateContext)} style="cursor: pointer">
                    en
                </button>
            </div>
        );
    },
    {
        tagName: 'header',
    }
);

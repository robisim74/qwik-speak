import { component$, useContext } from '@builder.io/qwik';
import { TranslationContext } from '../core/constants';
import { useTranslate as t } from '../core/use-translate';
import { useLocale } from '../core/use.locale';

export const Header = component$(
    () => {
        const translationContext = useContext(TranslationContext);

        return (
            <div>
                <h1>{t('title')}</h1>
                <p>{t('changeLocale')}</p>
                <button onClick$={async () => await useLocale({ language: 'it-IT' }, translationContext)} style="cursor: pointer">
                    it
                </button>
                <br />
                <button onClick$={async () => await useLocale({ language: 'en-US' }, translationContext)} style="cursor: pointer">
                    en
                </button>
            </div>
        );
    },
    {
        tagName: 'header',
    }
);

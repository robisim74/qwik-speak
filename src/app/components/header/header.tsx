import { component$, Host, useStyles$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

import { ChangeLocale } from './change-locale';
import { translate as t } from '../../../library/translate';

import styles from './header.css?inline';

export const Header = component$(
    () => {
        useStyles$(styles);

        const pathname = useLocation().pathname;

        return (
            <Host>
                <section>
                    <a href="/">Qwik Speak ⚡️</a>
                </section>
                <nav>
                    <a href="/" class={{ active: pathname === '/' }}>
                        {t('app.home')}
                    </a>
                    <a href="/page" class={{ active: pathname === '/page' }}>
                        {t('app.page')}
                    </a>
                </nav>
                <ChangeLocale />
            </Host>
        );
    },
    {
        tagName: 'header',
    }
);

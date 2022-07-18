import { component$, Host, useStyles$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

import { ChangeLocale } from './change-locale';

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
                        Home
                    </a>
                    <a href="/lazy" class={{ active: pathname === '/lazy' }}>
                        Lazy
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

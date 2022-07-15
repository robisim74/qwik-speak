import { component$ } from '@builder.io/qwik';
import { useTranslate } from '../core/use-translate';

import { config } from './translate-config';
import { Header } from './header';
import { Hooks } from './hooks';

export const App = component$(() => {
    useTranslate(config);

    return (
        <>
            <Header />
            <Hooks />
        </>
    );
});

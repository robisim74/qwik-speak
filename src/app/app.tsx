import { component$ } from '@builder.io/qwik';
import { useTranslation } from '../core/use-translation';

import { config } from './translation-config';
import { Header } from './header';
import { Hooks } from './hooks';

/**
 * Application component will be rerendered when locale changes
 */
export const App = component$(() => {
    useTranslation(config);

    return (
        <>
            <Header />
            <Hooks />
        </>
    );
});

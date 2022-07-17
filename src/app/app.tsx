import { component$ } from '@builder.io/qwik';
import { useSpeak } from '../core/use-speak';

import { config, translateFn } from './speak-config';
import { Header } from './header';
import { Hooks } from './hooks';

export const App = component$(() => {
    useSpeak(config, /* translateFn */);

    return (
        <>
            <Header />
            <Hooks />
        </>
    );
});

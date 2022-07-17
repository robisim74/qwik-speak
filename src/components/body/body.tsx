import { component$, Host } from '@builder.io/qwik';
import { Content } from '@builder.io/qwik-city';
import { useSpeak } from '../../core/use-speak';

import { config, translateFn } from './speak-config';

export const Body = component$(
    () => {
        useSpeak(config, /* translateFn */);

        return (
            <Host>
                <Content />
            </Host>
        );
    },
    {
        tagName: 'body',
    }
);

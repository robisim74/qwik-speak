import { component$, Host, useContextProvider, useStore } from '@builder.io/qwik';
import { Content } from '@builder.io/qwik-city';
import { RenderOptions } from '@builder.io/qwik/server';

import { HeadersContext } from '../../speak-config';

export const Body = component$(
    (props: { opts?: RenderOptions }) => {
        // Get headers from opts
        const cookie = props.opts?.userContext?.qcResponse?.headers?.cookie;
        const acceptLanguage = props.opts?.userContext?.qcResponse?.headers?.acceptLanguage;

        // Create a context for the headers
        const state = useStore({ cookie: cookie, acceptLanguage: acceptLanguage });
        useContextProvider(HeadersContext, state);

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

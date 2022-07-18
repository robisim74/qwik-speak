import { Html } from '@builder.io/qwik-city';
import { RenderOptions } from '@builder.io/qwik/server';
import { Body } from './app/components/body/body';
import { Head } from './app/components/head/head';

import './global.css';

export default (props: { opts?: RenderOptions }) => {
    return (
        <Html>
            <Head />
            <Body opts={props.opts} />
        </Html>
    );
};

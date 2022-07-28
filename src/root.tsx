import { Content, Html } from '@builder.io/qwik-city';
import { Head } from './app/components/head/head';

import './global.css';

export default () => {
  return (
    <Html>
      <Head />
      <body>
        <Content />
      </body>
    </Html>
  );
};

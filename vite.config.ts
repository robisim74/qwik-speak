import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { qwikSpeak } from './tools/inline';

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity({
        routesDir: './src/app/routes',
      }),
      qwikVite(),
      qwikSpeak({
        supportedLangs: ['en-US', 'it-IT'],
        defaultLang: 'en-US'
      }),
      tsconfigPaths(),
    ],
  };
});

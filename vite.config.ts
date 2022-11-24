import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { qwikSpeakInline } from './tools/inline';

export default defineConfig(() => {
  return {
    build: {
      minify: false
    },
    plugins: [
      qwikCity({
        routesDir: './src/app/routes',
        // https://github.com/BuilderIO/qwik/issues/2262
        trailingSlash: false
      }),
      qwikVite(),
      qwikSpeakInline({
        supportedLangs: ['en-US', 'it-IT'],
        defaultLang: 'en-US',
        //splitChunks: true
      }),
      tsconfigPaths(),
    ],
  };
});

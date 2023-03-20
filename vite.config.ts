import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { fileURLToPath } from 'url';
import { qwikSpeakInline } from './packages/qwik-speak/tools/inline';

export default defineConfig(() => {
  return {
    build: {
      minify: false // To inspect production files
    },
    plugins: [
      qwikCity(),
      qwikVite({
        // Handle packages
        vendorRoots: [
          fileURLToPath(new URL('./packages/qwik-speak/src', import.meta.url))
        ]
      }),
      qwikSpeakInline({
        supportedLangs: ['en-US', 'it-IT'],
        defaultLang: 'en-US'
      }),
      tsconfigPaths()
    ],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
    test: {
      include: ['./src/**']
    },
  };
});

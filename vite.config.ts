import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import Inspect from 'vite-plugin-inspect'

import { fileURLToPath } from 'url';
import { qwikSpeakInline } from './packages/qwik-speak/tools/inline';

// import { rewriteRoutes } from './src/speak-routes';

export default defineConfig(() => {
  return {
    build: {
      minify: false // To inspect production files
    },
    // Handle packages
    resolve: {
      alias: [
        { find: 'qwik-speak', replacement: fileURLToPath(new URL('./packages/qwik-speak/lib/index.qwik.mjs', import.meta.url)) },
      ]
    },
    plugins: [
      qwikCity(
        /** Uncomment this line to use url rewriting to translate paths */
        // { rewriteRoutes }
      ),
      qwikVite({
        // Handle packages
        vendorRoots: [
          fileURLToPath(new URL('./packages/qwik-speak/lib', import.meta.url))
        ]
      }),
      qwikSpeakInline({
        supportedLangs: ['en-US', 'it-IT', 'de-DE'],
        defaultLang: 'en-US',
        assetsPath: 'i18n',
        autoKeys: true
      }),
      tsconfigPaths(),
      //Inspect()
    ],
    optimizeDeps: {
      exclude: [],
      include: [],
    },
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

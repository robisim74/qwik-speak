import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
/* VITE_IMPORTS */

export default defineConfig(() => {
  return {
    /* VITE_CONFIG */
    publicDir: '', // Exclude public folder from lib
    build: {
      lib: {
        entry: './src/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format}.qwik.js`,
      },
    },
    plugins: [
      qwikCity({
        routesDir: './src/app/routes',
      }),
      qwikVite(/* VITE_QWIK */),
      /* VITE_PLUGINS */
    ],
  };
});

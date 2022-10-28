import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { readFile } from 'fs/promises';

export default defineConfig(() => {
  return {
    publicDir: '', // Exclude public folder from lib
    build: {
      target: 'es2020',
      lib: {
        entry: './src/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.qwik.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      rollupOptions: {
        output: {
          banner: () => readFile('./banner.txt', 'utf8')
        }
      }
    },
    plugins: [
      qwikVite(),
    ]
  };
});

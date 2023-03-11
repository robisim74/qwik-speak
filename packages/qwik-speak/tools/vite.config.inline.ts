import { defineConfig } from 'vite';
import { readFile } from 'fs/promises';

export default defineConfig(() => {
  return {
    publicDir: '',
    build: {
      outDir: 'inline',
      target: 'es2020',
      lib: {
        entry: 'tools/inline/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      rollupOptions: {
        output: {
          banner: () => readFile('./banner.txt', 'utf8')
        },
        external: [
          'fs',
          'fs/promises',
          'path'
        ]
      }
    }
  };
});

import { defineConfig } from 'vite';
import shebang from 'rollup-plugin-add-shebang';
import { readFile } from 'fs/promises';

export default defineConfig(() => {
  return {
    publicDir: '',
    build: {
      outDir: 'extract',
      target: 'es2020',
      lib: {
        entry: ['tools/extract/index.ts', 'tools/extract/cli.ts'],
        formats: ['es'],
        fileName: (format, entryName) => `${entryName}.js`,
      },
      rollupOptions: {
        output: {
          banner: () => readFile('./banner.txt', 'utf8')
        },
        external: [
          'fs',
          'fs/promises',
          'path'
        ],
        plugins: [
          shebang({
            shebang: '#!/usr/bin/env node',
            include: ['./extract/cli.js']
          })
        ]
      }
    }
  };
});

import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(() => {
  return {
    publicDir: '',
    build: {
      outDir: 'extract',
      target: 'es2020',
      lib: {
        entry: 'tools/extract/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      rollupOptions: {
        external: [
          'fs',
          'fs/promises',
          'path'
        ]
      }
    },
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: 'tools/extract/cli.js',
            dest: './'
          }
        ]
      })
    ]
  };
});

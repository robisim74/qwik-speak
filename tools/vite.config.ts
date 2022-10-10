import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    publicDir: '',
    build: {
      outDir: 'inline',
      target: 'es2020',
      lib: {
        entry: 'tools/inline/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      rollupOptions: {
        external: [
          'fs',
          'fs/promises',
          'path',
          'util'
        ]
      }
    }
  };
});

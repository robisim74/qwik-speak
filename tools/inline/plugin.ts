import type { Plugin } from 'vite';
import type { RenderedChunk } from 'rollup';
import { readFile, readdir } from 'fs/promises';
import path from 'path';

import type { QwikSpeakInlineVitePluginOptions, Translation } from './types';

/**
 * Qwik Speak Inline - Vite plugin
 * @param options 
 * @returns 
 */
export function qwikSpeak(options: QwikSpeakInlineVitePluginOptions): Plugin {
  // Resolve options
  options.basePath = options.basePath ?? './';
  options.assetsPath = options.assetsPath ?? 'public/i18n';

  // Resolve translation data
  const translation: Translation = Object.fromEntries(options.supportedLangs.map(value => [value, {}]));

  const plugin: Plugin = {
    name: 'qwik-speak-inline-vite-plugin',
    enforce: 'post',
    // Apply only on build
    apply: 'build',

    /**
     * Load translation files when build starts
     */
    async buildStart() {
      // For all langs
      await Promise.all(options.supportedLangs.map(async lang => {
        const baseDir = `${options.basePath}${options.assetsPath}/${lang}`;
        // For all files
        const files = await readdir(baseDir);

        if (files?.length > 0) {
          const ext = path.extname(files[0]);
          let data: Translation = {};

          const tasks = files.map(filename => readFile(`${baseDir}/${filename}`, 'utf8'));
          const sources = await Promise.all(tasks);

          for (const source of sources) {
            if (source) {
              switch (ext) {
                case '.json':
                  data = await parseJson(data, source);
                  break;
              }
            }
          }

          translation[lang] = { ...translation[lang], ...data }; // Shallow merge
        }
      }));
    },

    /**
     * Inline translation data in chunk files
     */
    async renderChunk(code: string, chunk: RenderedChunk) {
      return code;
    },
  };

  return plugin;
};

export async function parseJson(target: Translation, source: string): Promise<Translation> {
  target = { ...target, ...JSON.parse(source) };
  return target;
};

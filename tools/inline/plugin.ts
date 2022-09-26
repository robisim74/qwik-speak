import type { QwikSpeakInlineVitePluginOptions, Translation } from './types';
import { fileRegex } from './constants';

/**
 * Qwik Speak Inline - Vite plugin
 * @param options 
 * @returns 
 */
export function qwikSpeak(options: QwikSpeakInlineVitePluginOptions) {
  // Resolve options
  options.$translateAlias = options.$translateAlias ?? '$translate';
  options.assetsDir = options.assetsDir ?? 'public/i18n';
  options.format = options.format ?? 'json';

  // Resolve translation data
  const translation: Translation = Object.fromEntries(options.supportedLangs.map(value => [value, {}]));

  // Todo: get translation data



  return {
    name: 'qwik-speak-inline-vite-plugin',
    enforce: 'post',
    // Apply only on build
    apply: 'build',
    // Before bundling & minifying
    transform(code: string, id: string) {
      if (fileRegex.test(id)) {
        // Todo: inlining


        return {
          code: code
        };
      };
    }
  };
};

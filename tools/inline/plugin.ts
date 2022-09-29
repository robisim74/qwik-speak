import type { Plugin } from 'vite';
import type { RenderedChunk } from 'rollup';
import { readFile, readdir } from 'fs/promises';
import path from 'path';

import type { QwikSpeakInlineOptions, Translation } from './types';
import { translateFnTest, translateFnMatch, translateFnSignatureMatch, globalLang } from './constants';
import log from '../logger';

/**
 * Qwik Speak Inline Vite plugin
 * 
 * Inline $translate values: $lang === 'lang' && 'value' || 'default value'
 */
export function qwikSpeakInline(options: QwikSpeakInlineOptions): Plugin {
  // Resolve options
  const opts: Required<QwikSpeakInlineOptions> = {
    ...options,
    basePath: options.basePath ?? './',
    assetsPath: options.assetsPath ?? 'public/i18n',
    keySeparator: options.keySeparator ?? '.',
    keyValueSeparator: options.keyValueSeparator ?? '@@',
  }

  // Resolve translation data
  const translation: Translation = Object.fromEntries(opts.supportedLangs.map(value => [value, {}]));

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
      await Promise.all(opts.supportedLangs.map(async lang => {
        const baseDir = `${opts.basePath}${opts.assetsPath}/${lang}`;
        // For all files
        const files = await readdir(baseDir);

        if (files.length > 0) {
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
      if (!translateFnTest.test(code)) return null; // no transformation

      if (chunk.fileName.startsWith('entry')) log(chunk.fileName);
      return inline(code, translation, opts);
    },

    async closeBundle() {
      log(`Qwik Speak Inline: build ends at ${new Date().toLocaleString()}`);
    }
  };

  return plugin;
}

export async function parseJson(target: Translation, source: string): Promise<Translation> {
  target = { ...target, ...JSON.parse(source) };
  return target;
}

export function inline(
  code: string,
  translation: Translation,
  opts: Required<QwikSpeakInlineOptions>
): string | null {
  const matches = code.match(translateFnMatch);
  if (!matches) return null;

  for (const originalFn of matches) {
    // Get signature
    const signature = originalFn.match(translateFnSignatureMatch);
    // Get signature parameters
    if (signature) {
      // Get params
      const params = getParams(signature);

      // Skip internals
      if (params[0] === "'key'") continue;
      // Skip multilingual ('lang' param)
      if (params[3]) continue;

      // Get key
      const key = getKey(params[0], opts.keyValueSeparator);

      // Get default value
      const defaultValue = getValue(key, translation[opts.defaultLang], params[1], opts.keySeparator);
      if (!defaultValue) {
        log(`${opts.defaultLang}: key not found or dynamic: ${key} - Skip`);
        continue;
      }

      // Map of values
      const values = new Map<string, string>();
      values.set(opts.defaultLang, defaultValue);

      for (const lang of opts.supportedLangs.filter(x => x !== opts.defaultLang)) {
        const value = getValue(key, translation[lang], params[1], opts.keySeparator);
        if (!value) {
          log(`${lang}: key not found or dynamic params: ${key}`);
          continue;
        }
        values.set(lang, value);
      }

      // Build translated line
      const line = buildLine(opts, values);

      // Replace
      code = code.replace(originalFn, line);
    }
  }

  return code;
}

export function getParams(signature: RegExpMatchArray): string[] {
  let params = signature[0].split(',');
  // Change all groups of white-spaces characters to a single space & trim the result
  params = params.map(x => x.replace(/\s+/g, ' ').trim());
  return params;
}

export function getKey(param: string, keyValueSeparator: string): string {
  // Trim "|'|`
  let key = param.replace(/(^("|'|`))|("|'|`)$/g, '');
  key = key.split(keyValueSeparator)[0];
  return key;
}

export function getValue(
  key: string,
  data: Translation,
  params: string | undefined,
  keySeparator: string
): string | undefined {
  const value = key.split(keySeparator).reduce((acc, cur) => (acc && acc[cur] != null) ? acc[cur] : null, data);
  if (typeof value === 'string') return params ? handleParams(value, params) : quoteValue(value);
  return undefined;
}

export function handleParams(value: string, params: string): string | undefined {
  // "{ name: 'Qwik Speak' }" => 'name'
  const paramNames = params.match(/(\w+(?=:|\s+:))/g);
  if (!paramNames) return undefined;

  // Trim { }
  params = params.replace(/(^({))|(})$/g, '');

  const splitParams = params.split(',');
  for (const param of splitParams) {
    const parts = param.split(':').map(x => x.trim());
    if (parts.length === 2) {
      value = value.replace(/{{\s?([^{}\s]*)\s?}}/g, (substring: string, parsedKey: string) => {
        return parsedKey === parts[0] ? interpolateParam(parts[1]) : substring;
      });
    }
  }
  return quoteValue(value);
}

/**
 * Ready for inlining
 * @param value 
 * @returns The value in backticks
 */
export function quoteValue(value: string): string {
  return '`' + value + '`';
}

export function interpolateParam(param: string): string {
  return '${' + param + '}';
}

/**
 * Build the translated line
 */
export function buildLine(opts: QwikSpeakInlineOptions, values: Map<string, string>): string {
  let translatedLine = '';
  for (const lang of opts.supportedLangs.filter(x => x !== opts.defaultLang)) {
    translatedLine += `${globalLang} === ${quoteValue(lang)} && ${values.get(lang)} || `;
  }
  translatedLine += values.get(opts.defaultLang);
  return translatedLine;
}

import type { Plugin } from 'vite';
import { readFile, readdir } from 'fs/promises';
import { createWriteStream } from 'fs';
import { extname, normalize } from 'path';

import type { QwikSpeakInlineOptions, Translation } from './types';
import { Argument, getTranslateAlias, parseJson, Property } from '../core/parser';
import { parseSequenceExpressions } from '../core/parser';

// Logs
const missingValues: string[] = [];
const dynamicKeys: string[] = [];
const dynamicParams: string[] = [];

/**
 * Qwik Speak Inline Vite plugin
 * 
 * Inline $translate values: $lang() === 'lang' && 'value' || 'value'
 */
export function qwikSpeakInline(options: QwikSpeakInlineOptions): Plugin {
  // Resolve options
  const resolvedOptions: Required<QwikSpeakInlineOptions> = {
    ...options,
    basePath: options.basePath ?? './',
    assetsPath: options.assetsPath ?? 'public/i18n',
    keySeparator: options.keySeparator ?? '.',
    keyValueSeparator: options.keyValueSeparator ?? '@@',
  }

  // Translation data
  const translation: Translation = Object.fromEntries(resolvedOptions.supportedLangs.map(value => [value, {}]));

  // Client or server files
  let target: string;
  let input: string | undefined;

  const plugin: Plugin = {
    name: 'vite-plugin-qwik-speak-inline',
    enforce: 'post',
    // Apply only on build
    apply: 'build',

    configResolved(resolvedConfig) {
      target = resolvedConfig.build?.ssr || resolvedConfig.mode === 'ssr' ? 'ssr' : 'client';

      const inputOption = resolvedConfig.build.rollupOptions.input;
      if (inputOption) {
        if (Array.isArray(inputOption))
          input = inputOption[0];
        else if (typeof inputOption === 'string')
          input = inputOption
      }
      input = input?.split('/').pop();
    },

    /**
     * Load translation files when build starts
     */
    async buildStart() {
      // For all langs
      await Promise.all(resolvedOptions.supportedLangs.map(async lang => {
        const baseDir = normalize(`${resolvedOptions.basePath}/${resolvedOptions.assetsPath}/${lang}`);
        // For all files
        const files = await readdir(baseDir);

        if (files.length > 0) {
          const ext = extname(files[0]);
          let data: Translation = {};

          const tasks = files.map(filename => readFile(`${baseDir}/${filename}`, 'utf8'));
          const sources = await Promise.all(tasks);

          for (const source of sources) {
            if (source) {
              switch (ext) {
                case '.json':
                  data = parseJson(data, source);
                  break;
              }
            }
          }

          translation[lang] = { ...translation[lang], ...data }; // Shallow merge
        }
      }));
    },

    /**
     * Inline translation data
     * 
     * Prefer transform hook because unused imports will be removed, unlike renderChunk
     */
    async transform(code: string, id: string) {
      // Filter id
      if (id.includes('/src') && id.endsWith('.js')) {
        // Filter code
        if (/\$translate/.test(code)) {
          return inline(code, translation, resolvedOptions);
        }
      }
    },

    async closeBundle() {
      // Logs
      const log = createWriteStream('./qwik-speak-inline.log', { flags: 'a' });

      log.write(`${target}: ` + (input ?? '-') + '\n');

      missingValues.forEach(x => log.write(x + '\n'));
      dynamicKeys.forEach(x => log.write(x + '\n'));
      dynamicParams.forEach(x => log.write(x + '\n'));

      log.write((`Qwik Speak Inline: build ends at ${new Date().toLocaleString()}\n`));
    }
  };

  return plugin;
}

export function inline(
  code: string,
  translation: Translation,
  opts: Required<QwikSpeakInlineOptions>
): string | null {
  const alias = getTranslateAlias(code);

  // Parse sequence
  const sequence = parseSequenceExpressions(code, alias);

  if (sequence.length === 0) return null;

  let replaced = false;
  for (const expr of sequence) {
    // Original function
    const originalFn = expr.value;
    // Arguments
    const args = expr.arguments;

    if (args?.[0]?.value) {
      // Dynamic key
      if (args[0].type === 'Identifier') {
        if (args[0].value !== 'key') dynamicKeys.push(`dynamic key: ${originalFn.replace(/\s+/g, ' ')} - skip`)
        continue;
      }
      if (args[0].type === 'Literal') {
        if (args[0].value !== 'key' && /\${.*}/.test(args[0].value)) {
          dynamicKeys.push(`dynamic key: ${originalFn.replace(/\s+/g, ' ')} - skip`)
          continue;
        }
      }

      // Dynamic argument
      if (args[1]?.type === 'Identifier' || args[1]?.type === 'CallExpression' ||
        args[2]?.type === 'Identifier' || args[2]?.type === 'CallExpression' ||
        args[3]?.type === 'Identifier' || args[3]?.type === 'CallExpression') {
        dynamicParams.push(`dynamic params: ${originalFn.replace(/\s+/g, ' ')} - skip`);
        continue;
      }

      let supportedLangs: string[];
      let defaultLang: string;
      let optionalLang: string | undefined;

      // Check multilingual
      if (args[3]?.type === 'Literal') {
        optionalLang = multilingual(args[3].value, opts.supportedLangs);
      }

      if (!optionalLang) {
        supportedLangs = opts.supportedLangs;
        defaultLang = opts.defaultLang;
      } else {
        supportedLangs = [optionalLang];
        defaultLang = optionalLang;
      }

      // Get key
      const key = getKey(args[0].value, opts.keyValueSeparator);

      // Get default value
      const defaultValue = getValue(key, translation[defaultLang], args[1], opts.keySeparator);
      if (!defaultValue) {
        missingValues.push(`${defaultLang} - missing value for key: ${key}`);
        continue;
      }

      // Map of values
      const values = new Map<string, string>();
      values.set(defaultLang, defaultValue);

      for (const lang of supportedLangs.filter(x => x !== defaultLang)) {
        const value = getValue(key, translation[lang], args[1], opts.keySeparator);
        if (!value) {
          missingValues.push(`${lang} - missing value for key: ${key}`);
          continue;
        }
        values.set(lang, value);
      }

      // Transpile
      const transpiled = transpileFn(values, supportedLangs, defaultLang);

      // Replace
      code = code.replace(originalFn, transpiled);
      replaced = true;
    }
  }

  // Add $lang
  if (replaced && opts.supportedLangs.length > 1) {
    code = addLang(code);
  }

  return code;
}

export function multilingual(lang: string | undefined, supportedLangs: string[]): string | undefined {
  if (!lang) return undefined;
  return supportedLangs.find(x => x === lang);
}

/**
 * Return the value in backticks
 */
export function quoteValue(value: string): string {
  return '`' + value + '`';
}

export function interpolateParam(property: Property): string {
  return property.value.type === 'Literal' ? "${'" + property.value.value + "'}" : '${' + property.value.value + '}';
}

export function getKey(key: string, keyValueSeparator: string): string {
  key = key.split(keyValueSeparator)[0];
  return key;
}

export function getValue(
  key: string,
  data: Translation,
  params: Argument | undefined,
  keySeparator: string
): string | undefined {
  const value = key.split(keySeparator).reduce((acc, cur) => (acc && acc[cur] != null) ? acc[cur] : null, data);
  if (typeof value === 'string') return params ? transpileParams(value, params) : quoteValue(value);
  return undefined;
}

export function transpileParams(value: string, params: Argument): string | undefined {
  if (params.properties) {
    for (const property of params.properties) {
      value = value.replace(/{{\s?([^{}\s]*)\s?}}/g, (token: string, key: string) => {
        return key === property.key.value ? interpolateParam(property) : token;
      });
    }
  }
  return quoteValue(value);
}

/**
 * Transpile the function
 */
export function transpileFn(values: Map<string, string>, supportedLangs: string[], defaultLang: string): string {
  let translation = '';
  for (const lang of supportedLangs.filter(x => x !== defaultLang)) {
    translation += `$lang() === ${quoteValue(lang)} && ${values.get(lang)} || `;
  }
  translation += values.get(defaultLang);
  return translation;
}

/**
 * Add $lang to component
 */
export function addLang(code: string): string {
  return code.replace(/^/, 'import { $lang } from "qwik-speak";\n');
}

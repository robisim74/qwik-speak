import type { Plugin } from 'vite';
import type { NormalizedOutputOptions, OutputBundle, OutputAsset, OutputChunk } from 'rollup';
import { readFile, readdir, writeFile } from 'fs/promises';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { extname, normalize } from 'path';

import type { QwikSpeakInlineOptions, Translation } from '../core/types';
import type { Argument, Property } from '../core/parser';
import { getPluralAlias, getTranslateAlias, parseJson } from '../core/parser';
import { parseSequenceExpressions } from '../core/parser';
import { getRules } from '../core/intl-parser';

// Logs
const missingValues: string[] = [];
const dynamicKeys: string[] = [];
const dynamicParams: string[] = [];

/**
 * Qwik Speak Inline Vite plugin
 * 
 * Inline $translate values
 */
export function qwikSpeakInline(options: QwikSpeakInlineOptions): Plugin {
  // Resolve options
  const resolvedOptions: Required<QwikSpeakInlineOptions> = {
    ...options,
    basePath: options.basePath ?? './',
    assetsPath: options.assetsPath ?? 'public/i18n',
    keySeparator: options.keySeparator ?? '.',
    keyValueSeparator: options.keyValueSeparator ?? '@@',
    splitChunks: options.splitChunks ?? false
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
      if (/\/src\//.test(id) && /\.(js|cjs|mjs|jsx|ts|tsx)$/.test(id)) {
        // Filter code: $plural
        if (/\$plural/.test(code)) {
          const pluralAlias = getPluralAlias(code);
          const translateAlias = getTranslateAlias(code, false);
          code = transformPlural(code, pluralAlias, translateAlias, resolvedOptions);
        }
        // Filter code: $translate
        if (/\$translate/.test(code)) {
          if (target === 'client' && resolvedOptions.splitChunks) {
            return inlinePlaceholder(code);
          }
          else {
            const translateAlias = getTranslateAlias(code);
            return inline(code, translation, translateAlias, resolvedOptions);
          }
        }
      }
    },

    /**
     * Split chunks by lang
     */
    async writeBundle(options: NormalizedOutputOptions, bundle: OutputBundle) {
      if (target === 'client' && resolvedOptions.splitChunks) {
        const dir = options.dir ? options.dir : normalize(`${resolvedOptions.basePath}/dist`);
        const bundles = Object.values(bundle);

        const tasks = resolvedOptions.supportedLangs
          .map(x => writeChunks(x, bundles, dir, translation, resolvedOptions));
        await Promise.all(tasks);
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

export function transformPlural(
  code: string,
  pluralAlias: string,
  translateAlias: string,
  opts: Required<QwikSpeakInlineOptions>
) {
  // Parse sequence
  const sequence = parseSequenceExpressions(code, pluralAlias);

  if (sequence.length === 0) return code;

  let replaced = false;
  for (const expr of sequence) {
    // Original function
    const originalFn = expr.value;
    // Arguments
    const args = expr.arguments;

    if (args?.length > 0) {
      if (checkDynamicPlural(args, originalFn)) continue;

      const { defaultLang, supportedLangs } = withLang(args[4], opts);

      // Map of rules
      const rules = new Map<string, string[]>();
      for (const lang of supportedLangs) {
        const rulesByLang = getRules(lang);
        rules.set(lang, [...rulesByLang]);
      }

      // Transpile
      const transpiled = transpilePluralFn(rules, supportedLangs, defaultLang, translateAlias, args, opts);

      // Replace
      code = code.replace(originalFn, transpiled);
      replaced = true;
    }
  }

  // Add $rule
  if (replaced) {
    code = addRule(code);
  }

  return code;
}

export function inline(
  code: string,
  translation: Translation,
  alias: string,
  opts: Required<QwikSpeakInlineOptions>
): string | null {
  // Parse sequence
  const sequence = parseSequenceExpressions(code, alias);

  if (sequence.length === 0) return null;

  let replaced = false;
  for (const expr of sequence) {
    // Original function
    const originalFn = expr.value;
    // Arguments
    const args = expr.arguments;

    if (args?.length > 0) {
      if (checkDynamic(args, originalFn)) continue;

      const { defaultLang, supportedLangs } = withLang(args[3], opts);

      // Map of values
      const values = new Map<string, string | Translation>();

      // Get array of keys or key
      if (args[0].type === 'ArrayExpression') {
        const keys = getKeys(args[0], opts.keyValueSeparator);

        for (const lang of supportedLangs) {
          const keyValues: (string | Translation)[] = [];
          for (const key of keys) {
            const value = getValue(key, translation[lang], args[1], opts.keySeparator);
            if (!value) {
              missingValues.push(`${lang} - missing value for key: ${key}`);
              continue;
            }
            keyValues.push(value);
          }

          values.set(lang, keyValues);
        }
      } else if (args?.[0]?.value) {
        const key = getKey(args[0].value, opts.keyValueSeparator);

        for (const lang of supportedLangs) {
          const value = getValue(key, translation[lang], args[1], opts.keySeparator);
          if (!value) {
            missingValues.push(`${lang} - missing value for key: ${key}`);
            continue;
          }
          values.set(lang, value);
        }
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

export function inlinePlaceholder(code: string): string | null {
  const alias = getTranslateAlias(code);

  // Parse sequence
  const sequence = parseSequenceExpressions(code, alias);

  if (sequence.length === 0) return null;

  for (const expr of sequence) {
    // Original function
    const originalFn = expr.value;
    // Arguments
    const args = expr.arguments;

    if (args?.length > 0) {
      if (checkDynamic(args, originalFn)) continue;

      // Transpile with $inline placeholder
      const transpiled = originalFn.replace(new RegExp(`${alias}\\(`, 's'), '$inline(');
      // Replace
      code = code.replace(originalFn, transpiled);
    }
  }

  return code;
}

export async function writeChunks(
  lang: string,
  bundles: (OutputAsset | OutputChunk)[],
  dir: string,
  translation: Translation,
  opts: Required<QwikSpeakInlineOptions>
) {
  const targetDir = normalize(`${dir}/build/${lang}`);
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const tasks: Promise<void>[] = [];
  for (const chunk of bundles) {
    if (chunk.type === 'chunk' && 'code' in chunk && /build\//.test(chunk.fileName)) {
      const filename = normalize(`${targetDir}/${chunk.fileName.split('/')[1]}`);
      const alias = '\\$inline';
      const code = inline(chunk.code, translation, alias, { ...opts, supportedLangs: [lang], defaultLang: lang });
      tasks.push(writeFile(filename, code || chunk.code));

      // Original chunks to default lang
      if (lang === opts.defaultLang) {
        const defaultTargetDir = normalize(`${dir}/build`);
        const defaultFilename = normalize(`${defaultTargetDir}/${chunk.fileName.split('/')[1]}`);
        tasks.push(writeFile(defaultFilename, code || chunk.code));
      }
    }
  }
  await Promise.all(tasks);
}

export function checkDynamic(args: Argument[], originalFn: string): boolean {
  if (args?.[0]?.value) {
    // Dynamic key
    if (args[0].type === 'Identifier') {
      if (args[0].value !== 'key' && args[0].value !== 'keys') dynamicKeys.push(`dynamic key: ${originalFn.replace(/\s+/g, ' ')} - skip`)
      return true;
    }
    if (args[0].type === 'Literal') {
      if (args[0].value !== 'key' && args[0].value !== 'keys' && /\${.*}/.test(args[0].value)) {
        dynamicKeys.push(`dynamic key: ${originalFn.replace(/\s+/g, ' ')} - skip`)
        return true;
      }
    }

    // Dynamic argument
    if (args[1]?.type === 'Identifier' || args[1]?.type === 'CallExpression' ||
      args[2]?.type === 'Identifier' || args[2]?.type === 'CallExpression' ||
      args[3]?.type === 'Identifier' || args[3]?.type === 'CallExpression') {
      dynamicParams.push(`dynamic params: ${originalFn.replace(/\s+/g, ' ')} - skip`);
      return true;
    }
  }
  return false;
}

export function checkDynamicPlural(args: Argument[], originalFn: string): boolean {
  if (args?.[0]?.value) {
    // Dynamic argument
    if (args[1]?.type === 'Identifier' || args[1]?.type === 'CallExpression' ||
      args[2]?.type === 'Identifier' || args[2]?.type === 'CallExpression' ||
      args[3]?.type === 'Identifier' || args[3]?.type === 'CallExpression' ||
      args[4]?.type === 'Identifier' || args[4]?.type === 'CallExpression') {
      dynamicParams.push(`dynamic plural: ${originalFn.replace(/\s+/g, ' ')} - skip`);
      return true;
    }
  }
  return false;
}

export function withLang(arg: Argument, opts: Required<QwikSpeakInlineOptions>) {
  let supportedLangs: string[];
  let defaultLang: string;
  let optionalLang: string | undefined;

  // Check multilingual
  if (arg?.type === 'Literal') {
    optionalLang = multilingual(arg.value, opts.supportedLangs);
  }

  if (!optionalLang) {
    supportedLangs = opts.supportedLangs;
    defaultLang = opts.defaultLang;
  } else {
    supportedLangs = [optionalLang];
    defaultLang = optionalLang;
  }
  return { defaultLang, supportedLangs };
}

export function multilingual(lang: string | undefined, supportedLangs: string[]): string | undefined {
  if (!lang) return undefined;
  return supportedLangs.find(x => x === lang);
}

/**
 * Return the value in backticks
 */
export function quoteValue(value: string): string {
  return !/^`.*`$/.test(value) ? '`' + value + '`' : value;
}

export function interpolateParam(property: Property): string {
  return property.value.type === 'Literal' ? "${'" + property.value.value + "'}" : '${' + property.value.value + '}';
}

export function getKey(key: string, keyValueSeparator: string): string {
  key = key.split(keyValueSeparator)[0];
  return key;
}

export function getKeys(key: Argument, keyValueSeparator: string): string[] {
  const keys: string[] = [];
  if (key.elements) {
    for (const element of key.elements) {
      if (element.type === 'Literal') {
        keys.push(element.value.split(keyValueSeparator)[0]);
      }
    }
  }
  return keys;
}

export function getValue(
  key: string,
  data: Translation,
  params: Argument | undefined,
  keySeparator: string
): string | Translation | undefined {
  const value = key.split(keySeparator).reduce((acc, cur) =>
    (acc && acc[cur] !== undefined) ?
      acc[cur] :
      undefined, data);

  if (value) {
    if (typeof value === 'string') return params ? transpileParams(value, params) : quoteValue(value);
    if (typeof value === 'object') return value;
  }

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
export function transpileFn(
  values: Map<string, string | Translation>,
  supportedLangs: string[],
  defaultLang: string
): string {
  let translation = '';
  for (const lang of supportedLangs.filter(x => x !== defaultLang)) {
    const value = values.get(lang);
    if (typeof value === 'object') {
      translation += `($lang(${quoteValue(lang)}) && ${stringifyObject(value)} || `;
    } else {
      translation += `$lang(${quoteValue(lang)}) && ${value} || `;
    }
  }
  const defaultValue = values.get(defaultLang);
  if (typeof defaultValue === 'object') {
    translation += translation ? `${stringifyObject(defaultValue)})` : `${stringifyObject(defaultValue)}`;
  } else {
    translation += defaultValue;
  }

  return translation;
}

/**
 * Ensure that values between backticks are not stringified
 */
export function stringifyObject(value: Translation): string {
  let strValue = JSON.stringify(value, replacer);
  strValue = strValue.replace(/("__qsOpenBt)|(__qsCloseBt")/g, '`');
  return strValue;
}

export function transpilePluralFn(
  rules: Map<string, string[]>,
  supportedLangs: string[],
  defaultLang: string,
  translateAlias: string,
  args: Argument[],
  opts: Required<QwikSpeakInlineOptions>
): string {
  let translation = '';

  const transpileRules = (lang: string): string => {
    let expr = '(';
    const rulesBylang = rules.get(lang);
    if (rulesBylang) {
      for (const rule of rulesBylang) {
        const prefix = args[1]?.value;
        const key = prefix ? `${prefix}${opts.keySeparator}${rule}` : rule;

        if (rule !== rulesBylang[rulesBylang.length - 1]) {
          if (args[2]?.properties) {
            const options = args[2].properties.map(p => `${p.key.value}: ${quoteValue(p.value.value)}`).join(', ');
            expr += `$rule(${quoteValue(lang)}, ${args[0].value}, ${quoteValue(rule)}, {${options}}) && 
            ${translateAlias}(${quoteValue(key)}, { value: ${args[0].value}}, ${args[3]?.value}, ${quoteValue(lang)}) || `;
          } else {
            expr += `$rule(${quoteValue(lang)}, ${args[0].value}, ${quoteValue(rule)}) && 
            ${translateAlias}(${quoteValue(key)}, { value: ${args[0].value}}, ${args[3]?.value}, ${quoteValue(lang)}) || `;
          }
        } else {
          expr += `${translateAlias}(${quoteValue(key)}, { value: ${args[0].value}}, ${args[3]?.value}, ${quoteValue(lang)})`;
        }
      }
    }
    expr += ')';
    return expr;
  }

  for (const lang of supportedLangs.filter(x => x !== defaultLang)) {
    translation += `$lang(${quoteValue(lang)}) && `;
    translation += transpileRules(lang);
    translation += ' || ';
  }

  translation += transpileRules(defaultLang);
  return translation;
}

/**
 * Add $lang to component
 */
export function addLang(code: string): string {
  if (!/^import\s*\{.*\$lang.*}\s*from\s*/s.test(code)) {
    code = code.replace(/^/, 'import { $lang } from "qwik-speak";\n');
  }
  return code;
}

/**
 * Add $rule to component
 */
export function addRule(code: string): string {
  if (!/^import\s*\{.*\$rule.*}\s*from\s*/s.test(code)) {
    code = code.replace(/^/, 'import { $rule } from "qwik-speak";\n');
  }
  return code;
}


/**
 * Replace quoted values with a placeholder
 */
function replacer(key: string, value: string | Translation) {
  if (typeof value === 'string' && /^`.*`$/.test(value)) return value.replace(/^`/, '__qsOpenBt').replace(/`$/, '__qsCloseBt');
  return value;
}

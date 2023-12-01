import type { Plugin } from 'vite';
import type { NormalizedOutputOptions, OutputBundle, OutputAsset, OutputChunk } from 'rollup';
import { readFile, readdir, writeFile } from 'fs/promises';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { extname, normalize } from 'path';

import type { QwikSpeakInlineOptions, Translation } from '../core/types';
import type { Argument, Property } from '../core/parser';
import {
  getInlineTranslateAlias,
  getInlinePluralAlias,
  parseJson,
  matchInlinePlural,
  matchInlineTranslate
} from '../core/parser';
import { parseSequenceExpressions } from '../core/parser';
import { getOptions, getRules } from '../core/intl-parser';
import { merge } from '../core/merge';

const inlineTranslatePlaceholder = '__qsInlineTranslate';
const inlinePluralPlaceholder = '__qsInlinePlural';

// Logs
const missingValues: string[] = [];
const dynamics: string[] = [];
const missingValueText = (lang: string, key: string) => `${lang} - ${key}`;
const dynamicText = (originalFn: string, text: string) => `dynamic ${text}: ${originalFn}`;

// Config
let target: 'ssr' | 'lib' | 'test' | 'client';
let mode: 'dev' | 'prod';
let input: string | undefined;

/**
 * Qwik Speak Inline Vite plugin
 */
export function qwikSpeakInline(options: QwikSpeakInlineOptions): Plugin {
  let baseDir = '';

  const loadAssets = async (lang: string): Promise<Translation> => {
    const dir = normalize(`${baseDir}/${lang}`);

    let translation: Translation = {};

    // For all files
    if (existsSync(dir)) {
      const files = await readdir(dir);
      if (files.length > 0) {
        const ext = extname(files[0]);
        const tasks = files.map(filename => readFile(`${dir}/${filename}`, 'utf8'));
        const sources = await Promise.all(tasks);

        for (const source of sources) {
          if (source) {
            let parsed: Translation = {};
            switch (ext) {
              case '.json':
                parsed = parseJson(source);
                break;
            }
            // Shallow merge
            translation = merge(translation, parsed);
          }
        }
      }
    }
    return translation;
  };

  // Resolve options
  const resolvedOptions: Required<QwikSpeakInlineOptions> = {
    ...options,
    basePath: options.basePath ?? './',
    assetsPath: options.assetsPath ?? 'i18n',
    loadAssets: options.loadAssets ?? loadAssets,
    outDir: options.outDir ?? 'dist',
    keySeparator: options.keySeparator ?? '.',
    keyValueSeparator: options.keyValueSeparator ?? '@@'
  };

  baseDir = `${resolvedOptions.basePath}/${resolvedOptions.assetsPath}`;

  // Translation data
  const translation: Translation = Object.fromEntries(resolvedOptions.supportedLangs.map(value => [value, {}]));

  // Current lang
  let devLang: string;

  // Inlined modules
  const moduleIds = new Set<string>();

  // PLUGIN HOOKS
  const plugin: Plugin = {
    name: 'vite-plugin-qwik-speak-inline',
    enforce: 'post',
    apply: undefined, // both

    configResolved(resolvedConfig) {
      if (resolvedConfig.build?.ssr || resolvedConfig.mode === 'ssr') {
        target = 'ssr';
      } else if (resolvedConfig.mode === 'lib') {
        target = 'lib';
      } else if (resolvedConfig.mode === 'test') {
        target = 'test';
      } else {
        target = 'client';
      }
      mode = resolvedConfig.isProduction || resolvedConfig.mode === 'production' ? 'prod' : 'dev';

      const inputOption = resolvedConfig.build?.rollupOptions?.input;
      if (inputOption) {
        if (Array.isArray(inputOption))
          input = inputOption[0];
        else if (typeof inputOption === 'string')
          input = inputOption
      }
      input = input?.split('/')?.pop();
    },

    configureServer(server) {
      // In dev mode, listen to lang from client 
      if (mode === 'dev') {
        server.ws.on('qwik-speak:lang', (data) => {
          if (devLang && devLang !== data.msg) {
            // Invalidate inlined modules
            for (const id of moduleIds) {
              const module = server.moduleGraph.getModuleById(id);
              if (module) server.moduleGraph.invalidateModule(module);
            }
            moduleIds.clear();
          }
          // Update current lang
          devLang = data.msg;
        });
      }
    },

    handleHotUpdate({ file, server }) {
      // Filter json
      if (new RegExp(resolvedOptions.assetsPath).test(file) && /\.(json)$/.test(file)) {
        for (const lang of resolvedOptions.supportedLangs) {
          if (new RegExp(lang).test(file)) {
            loadAssets(lang);
          }
        }
        // Invalidate inlined modules
        for (const id of moduleIds) {
          const module = server.moduleGraph.getModuleById(id);
          if (module) server.moduleGraph.invalidateModule(module);
        }
        moduleIds.clear();
      }
    },

    /**
     * Load translation files when build starts
     */
    async buildStart() {
      if (target === 'client' || mode === 'dev') {
        // For all langs
        await Promise.all(resolvedOptions.supportedLangs.map(async lang => {
          const data = await resolvedOptions.loadAssets(lang);
          Object.assign(translation[lang], data)
        }));
      }
    },

    /**
     * Transform functions
     * Prefer transform hook because unused imports will be removed, unlike renderChunk
     */
    async transform(code: string, id: string, options) {
      if (target === 'client' || (target === 'ssr' && options?.ssr === false)) {
        // Filter id
        if (/\/src\//.test(id) && /\.(js|cjs|mjs|jsx|ts|tsx)$/.test(id)) {
          // Filter code: inlinePlural
          if (matchInlinePlural(code)) {
            code = transformPlural(code);
          }
          // Filter code: inlineTranslate
          if (matchInlineTranslate(code)) {
            code = transformTranslate(code);
          }

          // Inline in dev mode
          if (mode === 'dev') {
            if (code.includes(inlineTranslatePlaceholder) ||
              code.includes(inlinePluralPlaceholder)) {
              code = inlineAll(code, devLang, resolvedOptions, translation);

              moduleIds.add(id);
            }
          }

          return code;
        }
      }

      // Check base url
      if (target === 'ssr') {
        if (id.endsWith('entry.ssr.tsx') || id.endsWith('entry.ssr.jsx')) {
          if (!/(?<!\/\/\s*)base:\s*extractBase/.test(code)) {
            console.log(
              '\n\x1b[31mQwik Speak Inline error\x1b[0m\n%s',
              "Missing 'base' option in 'entry.ssr.tsx' file: see https://robisim74.gitbook.io/qwik-speak/tools/setup"
            );
            process.exit(1);
          }
        }
      }
    },

    /**
     * Split chunks by lang
     */
    async writeBundle(options: NormalizedOutputOptions, bundle: OutputBundle) {
      if (target === 'client') {
        const dir = options.dir ? options.dir : normalize(`${resolvedOptions.basePath}/${resolvedOptions.outDir}`);
        const bundles = Object.values(bundle);

        const tasks = resolvedOptions.supportedLangs
          .map(x => writeChunks(x, bundles, dir, translation, resolvedOptions));
        await Promise.all(tasks);
      }
    },

    async closeBundle() {
      if (target === 'client') {
        const log = createWriteStream('./qwik-speak-inline.log', { flags: 'w' });

        log.write(`${target}: ` + (input ?? '-') + '\n');

        log.write('\nMissing value for keys:\n');
        missingValues.forEach(x => log.write(x + '\n'));

        log.write("\nMake sure the keys are in 'runtimeAssets':\n");
        dynamics.forEach(x => log.write(x + '\n'));

        log.write((`\nQwik Speak Inline: build ends at ${new Date().toLocaleString()}\n`));

        if (missingValues.length > 0 || dynamics.length > 0) {
          console.log(
            '\n\x1b[33mQwik Speak Inline warn\x1b[0m\n%s',
            'There are missing values or dynamic keys: see ./qwik-speak-inline.log'
          );
        }
      }
    }
  };

  return plugin;
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

  // One chunk at a time to avoid "too many open files"
  for (const chunk of bundles) {
    const tasks: Promise<void>[] = [];
    if (chunk.type === 'chunk' && 'code' in chunk && /build\//.test(chunk.fileName)) {
      const filename = normalize(`${targetDir}/${chunk.fileName.split('/')[1]}`);

      // Inline
      let code = chunk.code;
      code = inlineAll(code, lang, opts, translation);
      tasks.push(writeFile(filename, code));

      // Original chunks to default lang
      if (lang === opts.defaultLang) {
        const defaultTargetDir = normalize(`${dir}/build`);
        const defaultFilename = normalize(`${defaultTargetDir}/${chunk.fileName.split('/')[1]}`);
        tasks.push(writeFile(defaultFilename, code));
      }
    }
    await Promise.all(tasks);
  }
}

/**
 * Transform inlineTranslate to placeholder
 */
export function transformTranslate(code: string): string {
  const alias = getInlineTranslateAlias(code);

  if (!alias) return code;

  let dynamic = false;
  // Parse sequence
  const sequence = parseSequenceExpressions(code, alias);

  if (sequence.length === 0) return code;

  for (const expr of sequence) {
    // Original function
    const originalFn = expr.value;
    // Arguments
    const args = expr.arguments;

    if (args?.length > 0) {
      // Dynamic
      if (checkDynamicTranslate(args, originalFn)) {
        dynamic = true;
        continue;
      }

      // Transpile with placeholder
      const transpiled = originalFn.replace(new RegExp(`${alias}\\(`), `${inlineTranslatePlaceholder}(`);
      // Replace
      code = code.replace(originalFn, transpiled);
    }
  }

  // Remove invocation
  if (!dynamic) {
    code = removeInlineTranslate(code, alias);
  }

  return code;
}

/**
 * Transform inlinePlural to placeholder
 */
export function transformPlural(code: string): string {
  const alias = getInlinePluralAlias(code);

  if (!alias) return code;

  let dynamic = false;
  // Parse sequence
  const sequence = parseSequenceExpressions(code, alias);

  if (sequence.length === 0) return code;

  for (const expr of sequence) {
    // Original function
    const originalFn = expr.value;
    // Arguments
    const args = expr.arguments;

    if (args?.length > 0) {
      if (checkDynamicPlural(args, originalFn)) {
        dynamic = true;
        continue;
      }

      // Transpile with placeholder
      const transpiled = originalFn.replace(new RegExp(`${alias}\\(`), `${inlinePluralPlaceholder}(`);
      // Replace
      code = code.replace(originalFn, transpiled);
    }
  }

  // Remove invocation
  if (!dynamic) {
    code = removeInlinePlural(code, alias);
  }

  return code;
}

export function inlineAll(
  code: string,
  lang: string,
  opts: Required<QwikSpeakInlineOptions>,
  translation: Translation
) {
  if (code.includes(inlinePluralPlaceholder)) {
    code = inlinePlural(code, inlinePluralPlaceholder, inlineTranslatePlaceholder, lang, opts);
  }
  if (code.includes(inlineTranslatePlaceholder)) {
    code = inlineTranslate(code, translation, inlineTranslatePlaceholder, lang, opts);
  }
  return code;
}

export function inlineTranslate(
  code: string,
  translation: Translation,
  placeholder: string,
  lang: string,
  opts: Required<QwikSpeakInlineOptions>
): string {
  // Parse sequence
  const sequence = parseSequenceExpressions(code, placeholder);

  if (sequence.length === 0) return code;

  for (const expr of sequence) {
    // Original function
    const originalFn = expr.value;
    // Arguments
    const args = expr.arguments;

    if (args?.length > 0) {
      const resolvedLang = withLang(lang, args[2], opts);

      let resolvedValue: string | Translation = quoteValue('');

      if (args[0].type === 'ArrayExpression') {
        const keys = getKeys(args[0]);

        const keyValues: (string | Translation)[] = [];
        for (const key of keys) {
          const value = getValue(
            key,
            translation[resolvedLang],
            args[1],
            opts.keySeparator,
            opts.keyValueSeparator,
            resolvedLang
          );
          keyValues.push(value);
        }
        resolvedValue = keyValues;
      } else if (args?.[0]?.value) {
        const key = getKey(args[0]);

        const value = getValue(
          key,
          translation[resolvedLang],
          args[1],
          opts.keySeparator,
          opts.keyValueSeparator,
          resolvedLang
        );

        resolvedValue = value;
      }

      // Transpile
      const transpiled = transpileTranslateFn(resolvedValue);

      // Replace
      code = code.replace(originalFn, transpiled);
    }
  }

  return code;
}

export function inlinePlural(
  code: string,
  pluralPlaceholder: string,
  placeholder: string,
  lang: string,
  opts: Required<QwikSpeakInlineOptions>
): string {
  // Parse sequence
  const sequence = parseSequenceExpressions(code, pluralPlaceholder);

  if (sequence.length === 0) return code;

  for (const expr of sequence) {
    // Original function
    const originalFn = expr.value;
    // Arguments
    const args = expr.arguments;

    if (args?.length > 0) {
      const resolvedLang = withLang(lang, args[4], opts);

      // Rules
      const options = getOptions(args[3]?.properties);
      const rules = getRules(resolvedLang, options);

      // Transpile
      const transpiled = transpilePluralFn(rules, resolvedLang, placeholder, args, opts);

      // Replace
      code = code.replace(originalFn, transpiled);
    }
  }

  return code;
}

/**
 * Transpile the translate function
 */
export function transpileTranslateFn(value: string | Translation): string {
  if (typeof value === 'object') {
    return `${stringifyObject(value)}`;
  } else {
    return value;
  }
}

/**
 * Transpile the plural function
 */
export function transpilePluralFn(
  rules: string[],
  lang: string,
  placeholder: string,
  args: Argument[],
  opts: Required<QwikSpeakInlineOptions>
): string {
  let translation = '';

  const transpileRules = (lang: string): string => {
    let expr = '(';
    for (const rule of rules) {
      let key = args[1]?.value;
      key = key ? `${key}${opts.keySeparator}${rule}` : rule;

      // Params
      const params: Property[] = [{
        type: 'Property',
        key: { type: 'Identifier', value: 'value' },
        value: { type: 'Expression', value: args[0].value! }
      }];
      if (args[2]?.properties) {
        for (const p of args[2].properties) {
          params.push(p);
        }
      }
      const strParams = params.map(p => `${p.key.value}: ${stringifyParam(p)}`).join(', ');

      if (rule !== rules[rules.length - 1]) {
        const strOptions = args[3]?.properties?.map(p => `${p.key.value}: ${stringifyParam(p)}`)?.join(', ');
        const strRule = stringifyRule(lang, args[0].value!, rule, strOptions);
        expr += (strRule + ` && ${placeholder}(${quoteValue(key)}, {${strParams}}, ${quoteValue(lang)}) || `);
      } else {
        expr += `${placeholder}(${quoteValue(key)}, {${strParams}}, ${quoteValue(lang)})`;
      }
    }
    expr += ')';
    return expr;
  }

  translation += transpileRules(lang);

  return translation;
}

export function checkDynamicTranslate(args: Argument[], originalFn: string): boolean {
  if (args?.[0]?.value) {
    // Dynamic key
    if (args[0].type === 'Identifier') {
      logDynamic(originalFn, 'key');
      return true;
    }
    if (args[0].type === 'Literal') {
      if (/\${.*}/.test(args[0].value)) {
        logDynamic(originalFn, 'key');
        return true;
      }
    }

    // Dynamic argument (params, lang)
    if (args[1]?.type === 'Identifier' || args[1]?.type === 'CallExpression' ||
      args[2]?.type === 'Identifier' || args[2]?.type === 'CallExpression') {
      logDynamic(originalFn, 'params');
      return true;
    }
  }
  return false;
}

export function checkDynamicPlural(args: Argument[], originalFn: string): boolean {
  if (args?.[0]?.value) {
    // Dynamic argument (key, params, options, lang)
    if (args[1]?.type === 'Identifier' || args[1]?.type === 'CallExpression' ||
      args[2]?.type === 'Identifier' || args[2]?.type === 'CallExpression' ||
      args[3]?.type === 'Identifier' || args[3]?.type === 'CallExpression' ||
      args[4]?.type === 'Identifier' || args[4]?.type === 'CallExpression') {
      logDynamic(originalFn, 'params');
      return true;
    }
  }
  return false;
}

export function withLang(lang: string, arg: Argument, opts: Required<QwikSpeakInlineOptions>): string {
  let optionalLang: string | undefined;

  // Check multilingual
  if (arg?.type === 'Literal') {
    optionalLang = opts.supportedLangs.find(x => x === arg.value);
  }

  return optionalLang ?? lang;
}

export function getKey(arg: Argument) {
  return arg.value!;
}

export function getKeys(arg: Argument) {
  const keys = [];
  if (arg.elements) {
    for (const element of arg.elements) {
      if (element.type === 'Literal') {
        keys.push(element.value);
      }
    }
  }
  return keys;
}

export const separateKeyValue = (key: string, keyValueSeparator: string): [string, string | undefined] => {
  return <[string, string | undefined]>key.split(keyValueSeparator);
};

export function getValue(
  key: string,
  data: Translation,
  params: Argument | undefined,
  keySeparator: string,
  keyValueSeparator: string,
  lang?: string
): string | Translation {
  let defaultValue: string | undefined = undefined;

  [key, defaultValue] = separateKeyValue(key, keyValueSeparator);

  const value = key.split(keySeparator).reduce((acc, cur) =>
    (acc && acc[cur] !== undefined) ?
      acc[cur] :
      undefined, data);

  if (value) {
    if (typeof value === 'string') return params ? transpileParams(value, params) : quoteValue(value);
    if (typeof value === 'object') return params ? transpileObjectParams(value, params) : value;
  } else if (lang) {
    logMissingValue(lang, key);
  }

  if (defaultValue) {
    if (!/^[[{].*[\]}]$/.test(defaultValue) || /^{{/.test(defaultValue))
      return params ? transpileParams(defaultValue, params) : quoteValue(defaultValue);
    // Default value is an array/object
    return params ? transpileObjectParams(JSON.parse(defaultValue), params) : JSON.parse(defaultValue);
  }

  return mode === 'dev' ? quoteValue(key) : quoteValue('');
}

export function transpileObjectParams(value: Translation, params?: Argument): Translation {
  Object.keys(value).map(k => {
    if (typeof value[k] === 'string') value[k] = params ? transpileParams(value[k], params) : quoteValue(value[k]);
    if (value[k] && typeof value[k] === 'object') value[k] = transpileObjectParams(value[k], params);
  });
  return value;
}

export function transpileParams(value: string, params: Argument): string {
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
 * Return the value in backticks
 */
export function quoteValue(value: string): string {
  return !/^`.*`$/.test(value) ? '`' + value + '`' : value;
}

export function interpolateParam(property: Property): string {
  return property.value.type === 'Literal' ? property.value.value : '${' + property.value.value + '}';
}

export function stringifyParam(property: Property): string {
  return property.value.type === 'Literal' ? quoteValue(property.value.value) : property.value.value;
}

export function stringifyRule(lang: string, value: string | number, rule: string, options?: string): string {
  if (options) {
    return `new Intl.PluralRules(${quoteValue(lang)}, {${options}}).select(+${value}) === ${quoteValue(rule)}`;
  } else {
    return `new Intl.PluralRules(${quoteValue(lang)}).select(+${value}) === ${quoteValue(rule)}`;
  }
}

/**
 * Ensure that values between backticks are not stringified
 */
export function stringifyObject(value: Translation): string {
  let strValue = JSON.stringify(value, replacer);
  strValue = strValue.replace(/("__qsOpenBt)|(__qsCloseBt")/g, '`');
  return strValue;
}

export function logMissingValue(lang: string, key: string) {
  const text = missingValueText(lang, key);
  if (!missingValues.includes(text)) {
    missingValues.push(text);
  }
}

export function logDynamic(originalFn: string, type: 'key' | 'params') {
  const text = dynamicText(trimFn(originalFn), type);
  if (!dynamics.includes(text)) {
    dynamics.push(text);
  }
}

export function trimFn(fn: string): string {
  return fn.replace(/\s+/g, ' ').trim();
}

export function removeInlineTranslate(code: string, alias: string): string {
  return code.replace(new RegExp(`\\bconst\\s${alias}\\s=\\sinlineTranslate\\(\\);?`, 'g'), '');
}

export function removeInlinePlural(code: string, alias: string): string {
  return code.replace(new RegExp(`\\bconst\\s${alias}\\s=\\sinlinePlural\\(\\);?`, 'g'), '');
}

/**
 * Replace quoted values with a placeholder
 */
function replacer(key: string, value: string | Translation): string | Translation {
  if (typeof value === 'string' && /^`.*`$/.test(value)) return value.replace(/^`/, '__qsOpenBt').replace(/`$/, '__qsCloseBt');
  return value;
}

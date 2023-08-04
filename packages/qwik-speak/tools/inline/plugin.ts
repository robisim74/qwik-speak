import type { Plugin } from 'vite';
import type { NormalizedOutputOptions, OutputBundle, OutputAsset, OutputChunk } from 'rollup';
import { readFile, readdir, writeFile } from 'fs/promises';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { extname, normalize } from 'path';

import type { QwikSpeakInlineOptions, Translation } from '../core/types';
import type { Argument, Property } from '../core/parser';
import { getUseTranslateAlias, getInlineTranslateAlias, getUsePluralAlias, parseJson, parse, tokenize } from '../core/parser';
import { parseSequenceExpressions } from '../core/parser';
import { getOptions, getRules } from '../core/intl-parser';
import { merge } from '../core/merge';

const inlinePlaceholder = '__qsInline';
const inlineTranslatePlaceholder = '__qsInlineTranslate';
const inlinePluralPlaceholder = '__qsInlinePlural';

const signalAlias = '\\b_fnSignal';

// Logs
const missingValues: string[] = [];
const dynamicKeys: string[] = [];
const dynamicParams: string[] = [];

/**
 * Qwik Speak Inline Vite plugin
 */
export function qwikSpeakInline(options: QwikSpeakInlineOptions): Plugin {
  // Resolve options
  const resolvedOptions: Required<QwikSpeakInlineOptions> = {
    ...options,
    basePath: options.basePath ?? './',
    assetsPath: options.assetsPath ?? 'i18n',
    outDir: options.outDir ?? 'dist',
    keySeparator: options.keySeparator ?? '.',
    keyValueSeparator: options.keyValueSeparator ?? '@@'
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

      const inputOption = resolvedConfig.build?.rollupOptions?.input;
      if (inputOption) {
        if (Array.isArray(inputOption))
          input = inputOption[0];
        else if (typeof inputOption === 'string')
          input = inputOption
      }
      input = input?.split('/')?.pop();
    },

    /**
     * Load translation files when build starts
     */
    async buildStart() {
      if (target === 'client') {
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
                let parsed: Translation = {};

                switch (ext) {
                  case '.json':
                    parsed = parseJson(source);
                    break;
                }

                data = merge(data, parsed);
              }
            }

            translation[lang] = { ...translation[lang], ...data }; // Shallow merge
          }
        }));
      }
    },

    /**
     * Transform functions
     * Prefer transform hook because unused imports will be removed, unlike renderChunk
     */
    async transform(code: string, id: string) {
      if (target === 'client') {
        // Filter id
        if (/\/src\//.test(id) && /\.(js|cjs|mjs|jsx|ts|tsx)$/.test(id)) {
          // Filter code: usePlural
          if (/usePlural/.test(code)) {
            code = transformPlural(code);
          }
          // Filter code: useTranslate
          if (/useTranslate/.test(code)) {
            code = transform(code);
          }
          // Filter code: inlineTranslate
          if (/inlineTranslate/.test(code)) {
            code = transformInline(code);
          }
          return code;
        }
      }

      // Check base url
      if (target === 'ssr') {
        if (id.endsWith('entry.ssr.tsx' || id.endsWith('entry.ssr.jsx'))) {
          if (!/(?<!\/\/\s*)base:\s*extractBase/.test(code)) {
            console.log(
              '\n\x1b[31mQwik Speak Inline error\x1b[0m\n%s',
              "Missing 'base' option in 'entry.ssr.tsx' file: see https://robisim74.gitbook.io/qwik-speak/tools/inline#usage"
            );
            process.exit(1)
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

        missingValues.forEach(x => log.write(x + '\n'));
        dynamicKeys.forEach(x => log.write(x + '\n'));
        dynamicParams.forEach(x => log.write(x + '\n'));

        log.write((`Qwik Speak Inline: build ends at ${new Date().toLocaleString()}\n`));

        if (missingValues.length > 0 || dynamicKeys.length > 0 || dynamicParams.length > 0) {
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
      if (code.includes(inlinePluralPlaceholder)) {
        code = inlinePlural(code, inlinePluralPlaceholder, inlinePlaceholder, lang, opts);
      }
      if (code.includes(inlinePlaceholder)) {
        code = inline(code, translation, inlinePlaceholder, lang, opts);
      }
      if (code.includes(inlineTranslatePlaceholder)) {
        code = inline(code, translation, inlineTranslatePlaceholder, lang, opts);
      }
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
 * Transform useTranslate to placeholder
 */
export function transform(code: string): string {
  const alias = getUseTranslateAlias(code);

  if (alias) {
    // Parse sequence
    const sequence = parseSequenceExpressions(code, alias);

    if (sequence.length === 0) return code;

    for (const expr of sequence) {
      // Original function
      const originalFn = expr.value;
      // Arguments
      const args = expr.arguments;

      if (args?.length > 0) {
        if (checkDynamic(args, originalFn)) continue;

        // Transpile with placeholder
        const transpiled = originalFn.replace(new RegExp(`${alias}\\(`), `${inlinePlaceholder}(`);
        // Replace
        code = code.replace(originalFn, transpiled);
      }
    }
  }

  // Props
  const sequence = parseSequenceExpressions(code, signalAlias);

  if (sequence.length === 0) return code;

  for (const expr of sequence) {
    // Arguments
    const args = expr.arguments;

    // Check identifier
    if (args?.length > 2) {
      if (args[args.length - 1].type === 'ArrayExpression') {
        const elements = args[args.length - 1].elements;
        if (elements && elements.find(element => new RegExp(`^${alias}$`).test(element.value))) {
          const index = elements.findIndex(element => new RegExp(`^${alias}$`).test(element.value));
          if (args[index].type === 'Identifier' && args[args.length - 2].type === 'CallExpression') {
            // Transformed function
            const transformedFn = args[args.length - 2].value;
            if (transformedFn && args[index].value) {
              const transformedAlias = `\\b${args[index].value}`;
              const tokens = tokenize(transformedFn);
              const transformedExpr = parse(tokens, transformedFn, transformedAlias);

              if (transformedExpr) {
                // Arguments
                const transformedArgs = transformedExpr.arguments;

                if (transformedArgs?.length > 0) {
                  if (checkDynamic(transformedArgs, transformedFn)) continue;

                  // Transpile with placeholder
                  const transpiled = transformedFn.replace(new RegExp(`${transformedAlias}\\(`), `${inlinePlaceholder}(`);
                  // Replace
                  code = code.replace(transformedFn, transpiled);
                }
              }
            }
          }
        }
      }
    }
  }

  return code;
}

/**
 * Transform inlineTranslate to placeholder
 */
export function transformInline(code: string): string {
  const alias = getInlineTranslateAlias(code);

  // Parse sequence
  const sequence = parseSequenceExpressions(code, alias);

  if (sequence.length === 0) return code;

  for (const expr of sequence) {
    // Original function
    const originalFn = expr.value;
    // Arguments
    const args = expr.arguments;

    if (args?.length > 0) {
      if (checkDynamicInline(args, originalFn)) continue;

      // Transpile with placeholder
      const transpiled = originalFn.replace(new RegExp(`${alias}\\(`), `${inlineTranslatePlaceholder}(`);
      // Replace
      code = code.replace(originalFn, transpiled);
    }
  }

  return code;
}

/**
 * Transform usePlural to placeholder
 */
export function transformPlural(code: string): string {
  const alias = getUsePluralAlias(code);

  if (alias) {
    // Parse sequence
    const sequence = parseSequenceExpressions(code, alias);

    if (sequence.length === 0) return code;

    for (const expr of sequence) {
      // Original function
      const originalFn = expr.value;
      // Arguments
      const args = expr.arguments;

      if (args?.length > 0) {
        if (checkDynamicPlural(args, originalFn)) continue;

        // Transpile with placeholder
        const transpiled = originalFn.replace(new RegExp(`${alias}\\(`), `${inlinePluralPlaceholder}(`);
        // Replace
        code = code.replace(originalFn, transpiled);
      }
    }
  }

  return code;
}

export function inline(
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
      const resolvedLang = withLang(lang, placeholder === inlinePlaceholder ? args[2] : args[3], opts);

      let resolvedValue: string | Translation = quoteValue('');

      // Get array of keys or key
      if (args[0].type === 'ArrayExpression') {
        const keys = getKeys(args[0], opts.keyValueSeparator);

        const keyValues: (string | Translation)[] = [];
        for (const { key, defaultValue } of keys) {
          const value = getValue(
            key,
            translation[resolvedLang],
            placeholder === inlinePlaceholder ? args[1] : args[2],
            opts.keySeparator
          );
          if (!value) {
            missingValues.push(`${resolvedLang} - missing value for key: ${key}`);
            if (defaultValue) {
              keyValues.push(quoteValue(defaultValue));
            } else {
              keyValues.push(quoteValue(''));
            }
          } else {
            keyValues.push(value);
          }
        }
        resolvedValue = keyValues;
      } else if (args?.[0]?.value) {
        const { key, defaultValue } = getKey(args[0].value, opts.keyValueSeparator);

        const value = getValue(
          key,
          translation[resolvedLang],
          placeholder === inlinePlaceholder ? args[1] : args[2],
          opts.keySeparator
        );
        if (!value) {
          missingValues.push(`${resolvedLang} - missing value for key: ${key}`);
          if (defaultValue) {
            resolvedValue = quoteValue(defaultValue);
          }
        } else {
          resolvedValue = value;
        }
      }

      // Transpile
      const transpiled = transpileFn(resolvedValue);

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
 * Transpile the function
 */
export function transpileFn(value: string | Translation): string {
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

export function checkDynamic(args: Argument[], originalFn: string): boolean {
  if (args?.[0]?.value) {
    // Dynamic key
    if (args[0].type === 'Identifier') {
      dynamicKeys.push(
        `dynamic key: ${originalFn.replace(/\s+/g, ' ')} - Make sure the keys are in 'runtimeAssets'`
      )
      return true;
    }
    if (args[0].type === 'Literal') {
      if (/\${.*}/.test(args[0].value)) {
        dynamicKeys.push(
          `dynamic key: ${originalFn.replace(/\s+/g, ' ')} - Make sure the keys are in 'runtimeAssets'`
        )
        return true;
      }
    }

    // Dynamic argument (params, lang)
    if (args[1]?.type === 'Identifier' || args[1]?.type === 'CallExpression' ||
      args[2]?.type === 'Identifier' || args[2]?.type === 'CallExpression') {
      dynamicParams.push(
        `dynamic params: ${originalFn.replace(/\s+/g, ' ')} - Make sure the keys are in 'runtimeAssets'`
      );
      return true;
    }
  }
  return false;
}

export function checkDynamicInline(args: Argument[], originalFn: string): boolean {
  if (args?.[0]?.value) {
    // Dynamic key
    if (args[0].type === 'Identifier') {
      dynamicKeys.push(
        `dynamic key: ${originalFn.replace(/\s+/g, ' ')} - Make sure the keys are in 'runtimeAssets'`
      )
      return true;
    }
    if (args[0].type === 'Literal') {
      if (/\${.*}/.test(args[0].value)) {
        dynamicKeys.push(
          `dynamic key: ${originalFn.replace(/\s+/g, ' ')} - Make sure the keys are in 'runtimeAssets'`
        )
        return true;
      }
    }

    // Dynamic argument (params, lang)
    if (args[2]?.type === 'Identifier' || args[2]?.type === 'CallExpression' ||
      args[3]?.type === 'Identifier' || args[3]?.type === 'CallExpression') {
      dynamicParams.push(`
      dynamic params: ${originalFn.replace(/\s+/g, ' ')} - Make sure the keys are in 'runtimeAssets'`
      );
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
      dynamicParams.push(
        `dynamic plural: ${originalFn.replace(/\s+/g, ' ')} - Make sure the keys are in 'runtimeAssets'`
      );
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

export function getKey(key: string, keyValueSeparator: string) {
  let defaultValue: string | undefined = undefined;
  [key, defaultValue] = separateKeyValue(key, keyValueSeparator);
  return { key, defaultValue };
}

export function getKeys(arg: Argument, keyValueSeparator: string) {
  const keys = [];
  if (arg.elements) {
    for (const element of arg.elements) {
      if (element.type === 'Literal') {
        let key: string;
        let defaultValue: string | undefined = undefined;
        [key, defaultValue] = separateKeyValue(element.value, keyValueSeparator);
        keys.push({ key, defaultValue });
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
  keySeparator: string
): string | Translation | undefined {
  const value = key.split(keySeparator).reduce((acc, cur) =>
    (acc && acc[cur] !== undefined) ?
      acc[cur] :
      undefined, data);

  if (value) {
    if (typeof value === 'string') return params ? transpileParams(value, params) : quoteValue(value);
    if (typeof value === 'object') return params ? transpileObjectParams(value, params) : value;
  }

  return undefined;
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

/**
 * Replace quoted values with a placeholder
 */
function replacer(key: string, value: string | Translation): string | Translation {
  if (typeof value === 'string' && /^`.*`$/.test(value)) return value.replace(/^`/, '__qsOpenBt').replace(/`$/, '__qsCloseBt');
  return value;
}



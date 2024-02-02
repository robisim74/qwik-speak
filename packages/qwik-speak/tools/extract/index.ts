import { readdir, readFile, writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { extname, join, normalize, parse } from 'path';

import type { QwikSpeakExtractOptions, Translation } from '../core/types';
import type { Argument, CallExpression, Element } from '../core/parser';
import {
  getInlinePluralAlias,
  getInlineTranslateAlias,
  matchInlinePlural,
  matchInlineTranslate,
  parseJson,
  parseSequenceExpressions
} from '../core/parser';
import { deepClone, deepMerge, deepMergeMissing, deepSet, deleteExtraProperties, merge } from '../core/merge';
import { sortTarget, toJsonString } from '../core/format';
import { getOptions, getRules } from '../core/intl-parser';
import { generateAutoKey, isExistingKey, isObjectPath } from '../core/autokeys';

/**
 * Extract translations from source files
 */
export async function qwikSpeakExtract(options: QwikSpeakExtractOptions) {
  // Resolve options
  const resolvedOptions: Required<QwikSpeakExtractOptions> = {
    ...options,
    basePath: options.basePath ?? './',
    sourceFilesPaths: options.sourceFilesPaths ?? ['src'],
    excludedPaths: options.excludedPaths ?? [],
    assetsPath: options.assetsPath ?? 'i18n',
    format: options.format ?? 'json',
    filename: options.filename ?? 'app',
    fallback: options.fallback ?? ((translation: Translation) => translation),
    keySeparator: options.keySeparator ?? '.',
    keyValueSeparator: options.keyValueSeparator ?? '@@',
    autoKeys: options.autoKeys ?? false,
    unusedKeys: options.unusedKeys ?? false,
    runtimeAssets: options.runtimeAssets ?? []
  }

  // Logs
  const stats = new Map<string, number>();

  const baseSources = resolvedOptions.sourceFilesPaths.map(value => normalize(`${resolvedOptions.basePath}/${value}`));
  const excludedPaths = resolvedOptions.excludedPaths.map(value => normalize(`${resolvedOptions.basePath}/${value}`));

  // Source files
  const sourceFiles: string[] = [];
  // Translation data
  let translation: Translation = Object.fromEntries(resolvedOptions.supportedLangs.map(value => [value, {}]));

  /**
   * Read source files recursively
   */
  const readSourceFiles = async (sourceFilesPath: string, excludedPaths: string[]) => {
    const files = await readdir(sourceFilesPath, { withFileTypes: true });
    for (const file of files) {
      const filePath = join(sourceFilesPath, file.name);
      const ext = extname(file.name);
      if (file.isDirectory()) {
        if (!excludedPaths.includes(filePath)) {
          await readSourceFiles(filePath, excludedPaths);
        }
      } else if (/\.js|\.ts|\.jsx|\.tsx/.test(ext) && !(/test|spec/).test(file.name)) {
        sourceFiles.push(filePath);
      }
    }
  };

  const checkDynamic = (element: Element | Argument): boolean => {
    // Dynamic key
    if (element.type === 'Identifier') {
      stats.set('dynamic', (stats.get('dynamic') ?? 0) + 1);
      return true;
    }
    if (element.type === 'Literal' && element.value) {
      if (/\${.*}/.test(element.value)) {
        stats.set('dynamic', (stats.get('dynamic') ?? 0) + 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Parse source file to return keys
   */
  const parseSourceFile = async (file: string): Promise<string[]> => {
    const keys: string[] = [];

    let code = await readFile(normalize(`${resolvedOptions.basePath}/${file}`), 'utf8');

    const clearTypes = (alias: string) => {
      code = code.replace(new RegExp(`${alias}<.*>\\(`, 'g'), `${alias.replace('\\b', '')}(`);
    }

    const parseSequence = (sequence: CallExpression[]) => {
      for (const expr of sequence) {
        const args = expr.arguments;

        if (args?.length > 0) {
          // Get array of keys or key
          if (args[0].type === 'ArrayExpression') {
            if (args[0].elements) {
              for (const element of args[0].elements) {
                if (element.type === 'Literal') {
                  if (checkDynamic(element))
                    continue;

                  keys.push(element.value);
                }
              }
            }
          } else if (args?.[0]?.value) {
            if (checkDynamic(args[0]))
              continue;

            keys.push(args[0].value);
          }
        }
      }
    }

    // inlineTranslate
    if (matchInlineTranslate(code)) {
      const alias = getInlineTranslateAlias(code);

      if (alias) {
        // Clear types
        clearTypes(alias);
        // Parse sequence
        const sequence = parseSequenceExpressions(code, alias);
        parseSequence(sequence);
      }
    }

    // inlinePlural
    if (matchInlinePlural(code)) {
      const alias = getInlinePluralAlias(code);

      if (alias) {
        // Parse sequence
        const sequence = parseSequenceExpressions(code, alias);

        for (const expr of sequence) {
          const args = expr.arguments;

          if (args?.length > 0) {
            // Dynamic argument (key, options)
            if (args[1]?.type === 'Identifier' || args[1]?.type === 'CallExpression' ||
              args[3]?.type === 'Identifier' || args[3]?.type === 'CallExpression') {
              stats.set('dynamic plural', (stats.get('dynamic plural') ?? 0) + 1);
              continue;
            }

            // Map of rules
            const rules = new Set<string>();
            const options = getOptions(args[3]?.properties);

            for (const lang of resolvedOptions.supportedLangs) {
              const rulesByLang = getRules(lang, options);
              for (const rule of rulesByLang) {
                rules.add(rule);
              }
            }

            const isUndefinedKey = (key?: string) => !key || key === 'undefined' || key === 'null';

            const separateKeyValue = (key: string, keyValueSeparator: string): [string, string | undefined] => {
              return <[string, string | undefined]>key.split(keyValueSeparator);
            };

            let key = args[1]?.value;

            let defaultValue: string | undefined = undefined;
            if (key) {
              [key, defaultValue] = separateKeyValue(key, resolvedOptions.keyValueSeparator);

              if (!defaultValue && /^{.*}$/.test(key)) {
                defaultValue = key;
                key = undefined;
              }
            }

            const defaultValues: Record<string, any> | undefined = defaultValue ? JSON.parse(defaultValue) : undefined;

            if (!isUndefinedKey(key) && !defaultValues) {
              const valueObj: any = {};
              for (const rule of rules) {
                valueObj[rule] = '';
              }
              keys.push(`${key}${resolvedOptions.keyValueSeparator}${JSON.stringify(valueObj)}`);
            } else if (isUndefinedKey(key) && !defaultValues) {
              for (const rule of rules) {
                keys.push(rule);
              }
            } else if (!isUndefinedKey(key) && !!defaultValues) {
              // Test if each rule has a corresponding defaultValues key.
              // If not, add it as empty string
              for (const rule of rules) {
                if (!defaultValues[rule]) {
                  defaultValues[rule] = '';
                }
              }
              keys.push(`${key}${resolvedOptions.keyValueSeparator}${JSON.stringify(defaultValues)}`);
            } else if (isUndefinedKey(key) && !!defaultValues) {
              key = generateAutoKey(defaultValues);
              // Test if each rule has a corresponding defaultValues key.
              // If not, add it as empty string
              for (const rule of rules) {
                if (!defaultValues[rule]) {
                  defaultValues[rule] = '';
                }
              }
              keys.push(`${key}${resolvedOptions.keyValueSeparator}${JSON.stringify(defaultValues)}`);
            }
          }
        }
      }
    }

    return keys;
  };

  /**
   * Read assets
   */
  const readAssets = async (): Promise<[Map<string, Translation>, Set<string>]> => {
    const assetsData = new Map<string, Translation>();
    let assetsFilenames = new Set<string>();

    for (const lang of resolvedOptions.supportedLangs) {
      const baseAssets = normalize(`${resolvedOptions.basePath}/${resolvedOptions.assetsPath}/${lang}`);

      if (existsSync(baseAssets)) {

        let files = await readdir(baseAssets);

        if (files.length > 0) {
          // Do not include runtime assets
          if (resolvedOptions.runtimeAssets.length > 0) {
            files = files.filter(filename => !resolvedOptions.runtimeAssets.includes(parse(filename).name));
          }
          if (files.length === 0) return [assetsData, assetsFilenames];

          const ext = extname(files[0]);

          let data: Translation = {};

          const tasks = files.map(filename => readFile(`${baseAssets}/${filename}`, 'utf8'));
          const sources = await Promise.all(tasks);

          for (const source of sources) {
            if (source) {
              let parsed: Translation = {};

              switch (ext) {
                case '.json':
                  parsed = parseJson(source);
                  break;
              }

              data = merge(data, parsed)
            }
          }

          assetsData.set(lang, data);
          assetsFilenames = new Set([...assetsFilenames, ...files.map(filename => parse(filename).name)]);
        }
      }
    }

    return [assetsData, assetsFilenames];
  };

  /**
   * Write translation data
   *
   * Naming convention of keys:
   * min depth > 0: filenames = each top-level property name
   * min depth = 0: filename = 'app'
   */
  const writeAssets = async (filenames: Set<string>) => {
    for (const lang of resolvedOptions.supportedLangs) {
      const baseAssets = normalize(`${resolvedOptions.basePath}/${resolvedOptions.assetsPath}/${lang}`);

      if (!existsSync(baseAssets)) {
        mkdirSync(baseAssets, { recursive: true });
      }

      const topLevelKeys = Object.keys(translation[lang])
        .filter(key => filenames.has(key));
      const bottomLevelKeys = Object.keys(translation[lang])
        .filter(key => !filenames.has(key));

      const bottomTranslation: Translation = {};
      if (translation[lang][resolvedOptions.filename]) {
        bottomTranslation[resolvedOptions.filename] = translation[lang][resolvedOptions.filename];
      }
      for (const bottomLevelKey of bottomLevelKeys) {
        bottomTranslation[bottomLevelKey] = translation[lang][bottomLevelKey];
      }
      if (Object.keys(bottomTranslation).length > 0) {
        await writeAsset(bottomTranslation, resolvedOptions.filename, baseAssets);
      }

      for (const topLevelKey of topLevelKeys.filter(key => key !== resolvedOptions.filename)) {
        await writeAsset({ [topLevelKey]: translation[lang][topLevelKey] }, topLevelKey, baseAssets);
      }
    }
  };

  const writeAsset = async (translation: Translation, filename: string, baseAssets: string) => {
    let data: string;
    switch (resolvedOptions.format) {
      case 'json':
        // Computed property name
        data = toJsonString(translation);
        break;
    }
    const file = normalize(`${baseAssets}/${filename}.${resolvedOptions.format}`);
    await writeFile(file, data);
    console.log(file);
  };

  /**
   * START PIPELINE
   */

  /* Read sources files */
  for (const baseSource of baseSources) {
    await readSourceFiles(baseSource, excludedPaths);
  }

  /* Parse sources */
  const tasks = sourceFiles.map(file => parseSourceFile(file));
  const sources = await Promise.all(tasks);

  let keys: string[] = [];
  for (const source of sources) {
    keys = keys.concat(source);
  }

  /* Unique keys */
  keys = [...new Set<string>(keys)];
  stats.set('unique keys', (stats.get('unique keys') ?? 0) + keys.length);

  /* Read assets */
  const [assetsData, assetsFilenames] = await readAssets();

  /* Deep set in translation data */
  const paths = new Set<string>();
  for (let key of keys) {
    let defaultValue: string | Translation | undefined = undefined;

    [key, defaultValue] = key.split(resolvedOptions.keyValueSeparator);

    // Objects/arrays
    if (/^[[{].*[\]}]$/.test(defaultValue) && !/^{{/.test(defaultValue)) {
      defaultValue = JSON.parse(defaultValue);
    }

    if (resolvedOptions.autoKeys) {
      // Auto keys should be backward compatible with existing keys. We don't want to override them
      if (
        key
        && !defaultValue
        && !isExistingKey(assetsData, key, resolvedOptions.keySeparator)
        && !isObjectPath(key, resolvedOptions.keySeparator)
      ) {
        defaultValue = `${key}`;
        key = generateAutoKey(key);
      }
    }

    for (const lang of resolvedOptions.supportedLangs) {
      deepSet(translation[lang], key.split(resolvedOptions.keySeparator), deepClone(defaultValue || ''));
    }

    // Add to paths
    paths.add(key);
  }

  /* Find filenames */
  const filenames = new Set<string>(assetsFilenames);
  for (const path of paths) {
    const segments = path.split(resolvedOptions.keySeparator);
    /* Min depth > 0 with no array position */
    if (segments.length > 1 && isNaN(+segments[1])) {
      filenames.add(segments[0])
    }
  }

  /* Drop unused keys */
  if (resolvedOptions.unusedKeys) {
    const deletedPaths = new Set<string>();
    for (const lang of resolvedOptions.supportedLangs) {
      const asset = assetsData.get(lang);
      if (asset) {
        const paths = deleteExtraProperties(asset, translation[lang], resolvedOptions.keySeparator);
        for (const path of paths) {
          deletedPaths.add(path);
        }
      }
    }
    stats.set('unused keys', (stats.get('unused keys') ?? 0) + deletedPaths.size);
  }

  /* Deep merge translation data */
  if (assetsData.size > 0) {
    for (const [lang, data] of assetsData) {
      deepMerge(translation[lang], data);
    }
  }

  /* Sort by key */
  for (const lang of resolvedOptions.supportedLangs) {
    translation[lang] = sortTarget(translation[lang]);
  }

  /* Fallback */
  translation = resolvedOptions.fallback(translation);

  /* Write translation data */
  await writeAssets(filenames);

  /* Log */
  for (const [key, value] of stats) {
    switch (key) {
      case 'unique keys':
        console.log('\x1b[32m%s\x1b[0m', `extracted keys: ${value}`);
        break;
      case 'dynamic':
        console.log('\x1b[32m%s\x1b[0m', `translations skipped due to dynamic keys: ${value}`);
        break;
      case 'dynamic plural':
        console.log('\x1b[32m%s\x1b[0m', `plurals skipped due to dynamic keys/options: ${value}`);
        break;
      case 'unused keys':
        console.log('\x1b[32m%s\x1b[0m', `unused keys removed: ${value}`);
        break;
    }
  }
}

export { deepMergeMissing };

export type { QwikSpeakExtractOptions, Translation };

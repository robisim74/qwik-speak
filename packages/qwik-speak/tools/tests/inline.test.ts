import { test, describe, expect, vi } from 'vitest';

import { writeFile } from 'fs/promises';
import { normalize } from 'path';

import { getRules } from '../core/intl-parser';
import { getKey, getValue, inline, qwikSpeakInline, transform, transformInline, transpileFn, transpilePluralFn } from '../inline/plugin';
import { mockChunkCode, mockCode, mockInlinedCode, mockInlinedCodeByLang, mockTransformedCode, mockTranslatedAsset, mockTranslatedAssetByLang } from './mock';

// Mock part of 'fs' module
vi.mock('fs', async () => {
  /* eslint-disable-next-line */
  const mod = await vi.importActual<typeof import('fs')>('fs');
  return {
    ...mod,
    mkdirSync: vi.fn()
  };
});
// Mock part of 'fs/promises' module
vi.mock('fs/promises', async () => {
  /* eslint-disable-next-line */
  const mod = await vi.importActual<typeof import('fs/promises')>('fs/promises');
  return {
    ...mod,
    readdir: vi.fn()
      .mockImplementationOnce(() => ['home.json'])
      .mockImplementationOnce(() => ['home.json']),
    readFile: vi.fn()
      .mockImplementationOnce(() => mockTranslatedAsset)
      .mockImplementationOnce(() => mockTranslatedAssetByLang),
    writeFile: vi.fn()
  };
});

describe('inline', () => {
  test('getKey', () => {
    let key = getKey('key1', '@@');
    expect(key).toBe('key1');
    key = getKey('key1@@Key1', '@@');
    expect(key).toBe('key1');
  });
  test('getValue', () => {
    let value = getValue('key1', { key1: 'Key1' }, undefined, '.');
    expect(value).toBe('`Key1`');
    value = getValue('key1.subkey1', { key1: { subkey1: 'Subkey1' } }, undefined, '.');
    expect(value).toBe('`Subkey1`');
    value = getValue('key1.subkey2', { key1: { subkey1: 'Subkey1' } }, undefined, '.');
    expect(value).toBeUndefined();
    value = getValue('key1', { key1: 'Key1 {{param1}}' }, {
      type: 'ObjectExpression', properties: [
        {
          type: 'Property',
          key: { type: 'Identifier', value: 'param1' },
          value: { type: 'Literal', value: 'Param1' }
        }
      ]
    }, '.');
    expect(value).toBe('`Key1 Param1`');
    value = getValue('key1', { key1: 'Key1 {{param1}} and {{param2}}' },
      {
        type: 'ObjectExpression', properties: [
          {
            type: 'Property',
            key: { type: 'Identifier', value: 'param1' },
            value: { type: 'Literal', value: 'Param1' }
          },
          {
            type: 'Property',
            key: { type: 'Identifier', value: 'param2' },
            value: { type: 'Identifier', value: 'variable' }
          }
        ]
      }, '.');
    expect(value).toBe('`Key1 Param1 and ${variable}`');
    value = getValue('key1', { key1: 'Key1' }, {
      type: 'ObjectExpression', properties: [
        {
          type: 'Property',
          key: { type: 'Identifier', value: 'param1' },
          value: { type: 'Literal', value: 'Param1' }
        }
      ]
    }, '.');
    expect(value).toBe('`Key1`');
    value = getValue('key1', { key1: 'Key1 {{param1}}' }, {
      type: 'ObjectExpression', properties: [
        {
          type: 'Property',
          key: { type: 'Identifier', value: 'param2' },
          value: { type: 'Literal', value: 'Param2' }
        }
      ]
    }, '.');
    expect(value).toBe('`Key1 {{param1}}`');
    value = getValue('key1', { key1: 'Key1 {{param1}}' },
      {
        type: 'ObjectExpression', properties: [
          {
            type: 'Property',
            key: { type: 'Identifier', value: 'param1' },
            value: { type: 'Literal', value: 'Param1 ${variable}' }
          }
        ]
      }, '.');
    expect(value).toBe('`Key1 Param1 ${variable}`');
  });
  test('transpileFn', () => {
    const value = '`Value`';
    const line = transpileFn(value);
    expect(line).toBe('`Value`');
  });
  test('transpileFn with array', () => {
    let value = ['`Value1`', '`Value2`'];
    let line = transpileFn(value);
    expect(line).toBe('[`Value1`,`Value2`]');
    value = ['Value1', 'Value2'];
    line = transpileFn(value);
    expect(line).toBe('["Value1","Value2"]');
  });
  test('transpileFn with objects', () => {
    const value = { value1: 'Value1' };
    const line = transpileFn(value);
    expect(line).toBe('{"value1":"Value1"}');
  });
  test('transpilePluralFn', () => {
    const rules = getRules('en-US');
    const line = transpilePluralFn(rules, 'en-US', '__qsInline',
      [
        { type: 'Identifier', value: 'count.value' },
        { type: 'Literal', value: 'home.devs' }
      ],
      { keySeparator: '.' } as any
    );
    expect(line).toBe('(new Intl.PluralRules(`en-US`).select(+count.value) === `other` && __qsInline(`home.devs.other`, {value: count.value}, `en-US`) || __qsInline(`home.devs.one`, {value: count.value}, `en-US`))');
  });
  test('transpilePluralFn with params and options', () => {
    const rules = getRules('en-US');
    const line = transpilePluralFn(rules, 'en-US', '__qsInline',
      [
        { type: 'Identifier', value: 'count.value' },
        { type: 'Literal', value: 'home.devs' },
        {
          type: 'ObjectExpression', properties: [{
            type: 'Property',
            key: { type: 'Identifier', value: 'role' },
            value: { type: 'Literal', value: 'software' }
          }]
        },
        {
          type: 'ObjectExpression', properties: [{
            type: 'Property',
            key: { type: 'Identifier', value: 'type' },
            value: { type: 'Literal', value: 'cardinal' }
          }]
        }
      ],
      { keySeparator: '.' } as any
    );
    expect(line).toBe('(new Intl.PluralRules(`en-US`, {type: `cardinal`}).select(+count.value) === `other` && __qsInline(`home.devs.other`, {value: count.value, role: `software`}, `en-US`) || __qsInline(`home.devs.one`, {value: count.value, role: `software`}, `en-US`))');
  });
  test('inline arrays', async () => {
    const inlined = inline(`const values = __qsInline(['app.title', 'app.subtitle'])`,
      {
        'en-US': {
          'app': {
            'subtitle': 'Translate your Qwik apps into any language',
            'title': 'Qwik Speak'
          }
        }
      },
      '__qsInline',
      'en-US',
      {
        supportedLangs: ['en-US', 'it-IT'],
        defaultLang: 'en-US',
        keySeparator: '.',
        keyValueSeparator: '@@',
        basePath: './',
        assetsPath: 'i18n',
        outDir: 'dist'
      });
    expect(inlined).toBe('const values = [`Qwik Speak`,`Translate your Qwik apps into any language`]');
  });
  test('transform & inline multilingual', async () => {
    const code = `import { $translate as t } from "qwik-speak";const value = t('app.subtitle', undefined, 'it-IT')`;
    const transformed = transform(code);
    const inlined = inline(transformed,
      {
        'en-US': {
          'app': {
            'subtitle': 'Translate your Qwik apps into any language',
          }
        },
        'it-IT': {
          'app': {
            'subtitle': 'Traduci le tue app Qwik in qualsiasi lingua',
          }
        }
      },
      '__qsInline',
      'en-US',
      {
        supportedLangs: ['en-US', 'it-IT'],
        defaultLang: 'en-US',
        keySeparator: '.',
        keyValueSeparator: '@@',
        basePath: './',
        assetsPath: 'i18n',
        outDir: 'dist'
      });
    expect(inlined).toBe('import { $translate as t } from "qwik-speak";const value = `Traduci le tue app Qwik in qualsiasi lingua`');
  });
  test('transform & inlineTranslate', async () => {
    const code = `import { $inlineTranslate as t } from "qwik-speak";const value = t('app.subtitle', ctx)`;
    const transformed = transformInline(code);
    const inlined = inline(transformed,
      {
        'en-US': {
          'app': {
            'subtitle': 'Translate your Qwik apps into any language',
          }
        }
      },
      '__qsInline',
      'en-US',
      {
        supportedLangs: ['en-US', 'it-IT'],
        defaultLang: 'en-US',
        keySeparator: '.',
        keyValueSeparator: '@@',
        basePath: './',
        assetsPath: 'i18n',
        outDir: 'dist'
      });
    expect(inlined).toBe('import { $inlineTranslate as t } from "qwik-speak";const value = `Translate your Qwik apps into any language`');
  });
  test('writeChunks', async () => {
    const plugin = qwikSpeakInline({
      supportedLangs: ['en-US', 'it-IT'],
      defaultLang: 'en-US',
      basePath: '../../'
    }) as any;
    await plugin.configResolved?.({});
    await plugin.buildStart?.();
    const transformed = await plugin.transform?.(mockCode, '/src/mock.code.js');
    expect(transformed).toBe(mockTransformedCode);
    await plugin.writeBundle?.({}, {
      'mock.chunk.js': {
        type: 'chunk',
        code: mockChunkCode,
        fileName: 'build/1.js'
      }
    });
    expect(writeFile).toHaveBeenCalledTimes(3);
    expect(writeFile).toHaveBeenNthCalledWith(1, normalize('../../dist/build/en-US/1.js'), mockInlinedCode);
    expect(writeFile).toHaveBeenNthCalledWith(2, normalize('../../dist/build/1.js'), mockInlinedCode);
    expect(writeFile).toHaveBeenNthCalledWith(3, normalize('../../dist/build/it-IT/1.js'), mockInlinedCodeByLang);
  });
});

import { test, describe, expect } from 'vitest';

import type { Translation } from '../core/types';
import { getKey, getValue, qwikSpeakInline, transpileFn, addLang } from '../inline/plugin';
import { inlinedCode, mockCode } from './mock';

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
    expect(value).toBe("`Key1 ${'Param1'}`");
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
    expect(value).toBe("`Key1 ${'Param1'} and ${variable}`");
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
  });
  test('transpileFn', () => {
    let values = new Map<string, string>();
    values.set('en-US', '`Value`');
    values.set('it-IT', '`Valore`');
    let line = transpileFn(values, ['en-US', 'it-IT'], 'en-US');
    expect(line).toBe('$lang(`it-IT`) && `Valore` || `Value`');
    values = new Map<string, string>();
    values.set('en-US', '`Value`');
    line = transpileFn(values, ['en-US'], 'en-US');
    expect(line).toBe('`Value`');
  });
  test('transpileFn with array', () => {
    let values = new Map<string, string[]>();
    values.set('en-US', ['`Value1`', '`Value2`']);
    values.set('it-IT', ['`Valore1`', '`Valore2`']);
    let line = transpileFn(values, ['en-US', 'it-IT'], 'en-US');
    expect(line).toBe('($lang(`it-IT`) && [`Valore1`,`Valore2`] || [`Value1`,`Value2`])');
    values = new Map<string, string[]>();
    values.set('en-US', ['Value1', 'Value2']);
    values.set('it-IT', ['Valore1', 'Valore2']);
    line = transpileFn(values, ['en-US', 'it-IT'], 'en-US');
    expect(line).toBe('($lang(`it-IT`) && ["Valore1","Valore2"] || ["Value1","Value2"])');
  });
  test('transpileFn with objects', () => {
    const values = new Map<string, Translation>();
    values.set('en-US', { value1: 'Value1' });
    values.set('it-IT', { value1: 'Valore1' });
    const line = transpileFn(values, ['en-US', 'it-IT'], 'en-US');
    expect(line).toBe('($lang(`it-IT`) && {"value1":"Valore1"} || {"value1":"Value1"})');
  });
  test('addLang', () => {
    const code = addLang(`import { useStore } from "@builder.io/qwik";
export const s_xJBzwgVGKaQ = ()=>{
    return /*#__PURE__*/ _jsxs(_Fragment, {
    });
};`);
    expect(code).toBe(`import { $lang } from "qwik-speak";
import { useStore } from "@builder.io/qwik";
export const s_xJBzwgVGKaQ = ()=>{
    return /*#__PURE__*/ _jsxs(_Fragment, {
    });
};`);
  });
  test('transform', async () => {
    const plugin = qwikSpeakInline({
      supportedLangs: ['en-US', 'it-IT'],
      defaultLang: 'en-US'
    }) as any;
    await plugin.buildStart?.();
    const inlined = await plugin.transform?.(mockCode, '/src/mock.code.js');
    expect(inlined).toBe(inlinedCode);
  });
  test('transform arrays', async () => {
    const plugin = qwikSpeakInline({
      supportedLangs: ['en-US', 'it-IT'],
      defaultLang: 'en-US'
    }) as any;
    await plugin.buildStart?.();
    const inlined = await plugin.transform?.(`const values = $translate(['app.title', 'app.subtitle'])`, '/src/mock.code.js');
    expect(inlined).toBe(`import { $lang } from "qwik-speak";
const values = ($lang(\`it-IT\`) && [\`Qwik Speak\`,\`Traduci le tue app Qwik in qualsiasi lingua\`] || [\`Qwik Speak\`,\`Translate your Qwik apps into any language\`])`);
  });
});

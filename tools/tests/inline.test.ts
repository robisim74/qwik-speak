import { getKey, getValue, qwikSpeakInline, transpileFn, getAlias, addLang } from '../inline/plugin';
import { inlinedCode, mockCode } from './mock';

describe('inline', () => {
  test('getAlias', () => {
    let alias = getAlias(`import {
      $translate as t,
      plural as p,
      formatDate as fd,
      formatNumber as fn,
      relativeTime as rt,
      Speak,
      useSpeakLocale
    } from 'qwik-speak';`);
    expect(alias).toBe('\\bt');
    alias = getAlias("import { $translate as t } from 'qwik-speak';");
    expect(alias).toBe('\\bt');
    alias = getAlias("import { $translate } from 'qwik-speak';");
    expect(alias).toBe('\\$translate');
  });
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
    expect(line).toBe('$lang === `it-IT` && `Valore` || `Value`');
    values = new Map<string, string>();
    values.set('en-US', '`Value`');
    line = transpileFn(values, ['en-US'], 'en-US');
    expect(line).toBe('`Value`');
  });
  test('addLang', () => {
    let code = addLang(`import { useStore } from "@builder.io/qwik";
export const s_xJBzwgVGKaQ = ()=>{
    return /*#__PURE__*/ _jsxs(_Fragment, {
    });
};`);
    expect(code).toBe(`import { useSpeakLocale } from "qwik-speak";
import { useStore } from "@builder.io/qwik";
export const s_xJBzwgVGKaQ = ()=>{
    const $lang = useSpeakLocale().lang;
    return /*#__PURE__*/ _jsxs(_Fragment, {
    });
};`);
    code = addLang(`import { useStore } from "@builder.io/qwik";
import { useSpeakLocale } from "qwik-speak";
export const s_xJBzwgVGKaQ = ()=>{
    return /*#__PURE__*/ _jsxs(_Fragment, {
    });
};`);
    expect(code).toBe(`import { useStore } from "@builder.io/qwik";
import { useSpeakLocale } from "qwik-speak";
export const s_xJBzwgVGKaQ = ()=>{
    const $lang = useSpeakLocale().lang;
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
});

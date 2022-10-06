import { getParams, getKey, getValue, qwikSpeakInline, buildLine, getAlias } from '../inline/plugin';
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
  test('getParams', () => {
    let params = getParams(`'key1.subkey1', {
      param1: 'Param1'
    }`);
    expect(params).toEqual([
      "'key1.subkey1'",
      "{ param1: 'Param1' }"
    ]);
    params = getParams(`"key1.subkey1", {
      param1: "Param1"
    }`);
    expect(params).toEqual([
      '"key1.subkey1"',
      '{ param1: "Param1" }'
    ]);
    params = getParams(`'key1.subkey1@@value, value', {
      param1: 'Param1, Param1',
      param2: Param2
    }, ctx, 'lang'`);
    expect(params).toEqual([
      "'key1.subkey1@@value, value'",
      "{ param1: 'Param1, Param1', param2: Param2 }",
      'ctx',
      "'lang'"
    ]);
    params = getParams("param1: 'Param1, Param1', param2: Param2");
    expect(params).toEqual([
      "param1: 'Param1, Param1'",
      'param2: Param2'
    ]);
  });
  test('getKey', () => {
    let key = getKey("'key1'", '@@');
    expect(key).toBe('key1');
    key = getKey('"key1"', '@@');
    expect(key).toBe('key1');
    key = getKey('`key1`', '@@');
    expect(key).toBe('key1');
    key = getKey("'key1@@Key1'", '@@');
    expect(key).toBe('key1');
  });
  test('getValue', () => {
    let value = getValue('key1', { key1: 'Key1' }, undefined, '.');
    expect(value).toBe('`Key1`');
    value = getValue('key1.subkey1', { key1: { subkey1: 'Subkey1' } }, undefined, '.');
    expect(value).toBe('`Subkey1`');
    value = getValue('key1.subkey2', { key1: { subkey1: 'Subkey1' } }, undefined, '.');
    expect(value).toBeUndefined();
    value = getValue('key1', { key1: 'Key1 {{param1}}' }, "{ param1: 'Param1' }", '.');
    expect(value).toBe("`Key1 ${'Param1'}`");
    value = getValue('key1', { key1: 'Key1 {{param1}} and {{param2}}' }, "{ param1: 'Param1', param2: variable }", '.');
    expect(value).toBe("`Key1 ${'Param1'} and ${variable}`");
    value = getValue('key1', { key1: 'Key1' }, "{ param1: 'Param1' }", '.');
    expect(value).toBe('`Key1`');
    value = getValue('key1', { key1: 'Key1 {{param1}}' }, "{ param2: 'Param2' }", '.');
    expect(value).toBe('`Key1 {{param1}}`');
  });
  test('buildLine', () => {
    let values = new Map<string, string>();
    values.set('en-US', '`Value`');
    values.set('it-IT', '`Valore`');
    let line = buildLine(values, ['en-US', 'it-IT'], 'en-US');
    expect(line).toBe('$lang === `it-IT` && `Valore` || `Value`');
    values = new Map<string, string>();
    values.set('en-US', '`Value`');
    line = buildLine(values, ['en-US'], 'en-US');
    expect(line).toBe('`Value`');
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

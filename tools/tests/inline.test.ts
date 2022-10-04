import { translateFnSignatureMatch } from '../inline/constants';
import { getParams, getKey, getValue, qwikSpeakInline, buildLine } from '../inline/plugin';
import { inlinedChunk, mockChunk } from './mock';

describe('inline', () => {
  test('getParams', () => {
    let originalFn = `$translate('key1.subkey1', {
      param1: 'Param1'
    })`;
    let args = originalFn.match(translateFnSignatureMatch)![0];
    let params = getParams(args);
    expect(params).toEqual([
      "'key1.subkey1'",
      "{ param1: 'Param1' }"
    ]);
    originalFn = `$translate("key1.subkey1", {
      param1: "Param1"
    })`;
    args = originalFn.match(translateFnSignatureMatch)![0];
    params = getParams(args);
    expect(params).toEqual([
      '"key1.subkey1"',
      '{ param1: "Param1" }'
    ]);
    originalFn = `$translate('key1.subkey1@@value, value', {
      param1: 'Param1, Param1',
      param2: Param2
    }, ctx, 'lang')`;
    args = originalFn.match(translateFnSignatureMatch)![0];
    params = getParams(args);
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
  test('renderChunk', async () => {
    const plugin = qwikSpeakInline({
      supportedLangs: ['en-US', 'it-IT'],
      defaultLang: 'en-US'
    }) as any;
    await plugin.buildStart?.();
    const inlined = await plugin.renderChunk?.(mockChunk, { fileName: 'mock-chunk' });
    expect(inlined).toBe(inlinedChunk);
  });
});

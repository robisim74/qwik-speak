import { translateFnSignatureMatch } from '../inline/constants';
import { getParams, getKey, getValue, qwikSpeakInline, buildLine } from '../inline/plugin';
import { inlinedChunk, mockChunk } from './mock';

describe('inline', () => {
  const originalFn = `$translate('home.greeting', {
      name: 'Qwik Speak'
  })`;
  const signature = <RegExpMatchArray>originalFn.match(translateFnSignatureMatch);
  test('getParams', () => {
    const params = getParams(signature);
    expect(params).toEqual(["'home.greeting'", "{ name: 'Qwik Speak' }"]);
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
    value = getValue('key1', { key1: 'Key1 {{param1}}' }, 'variable', '.');
    expect(value).toBeUndefined();
  });
  test('buildLine', () => {
    let opts = {
      supportedLangs: ['en-US', 'it-IT'],
      defaultLang: 'en-US'
    };
    let values = new Map<string, string>();
    values.set('en-US', '`Value`');
    values.set('it-IT', '`Valore`');
    let line = buildLine(opts, values);
    expect(line).toBe('$lang === `it-IT` && `Valore` || `Value`');
    opts = {
      supportedLangs: ['en-US'],
      defaultLang: 'en-US'
    };
    values = new Map<string, string>();
    values.set('en-US', '`Value`');
    line = buildLine(opts, values);
    expect(line).toBe('`Value`');
  });
  test('renderChunk', async () => {
    const plugin = qwikSpeakInline({
      supportedLangs: ['en-US', 'it-IT'],
      defaultLang: 'en-US'
    }) as any;
    await plugin.buildStart?.();
    const inlined = await plugin.renderChunk?.(mockChunk);
    expect(inlined).toBe(inlinedChunk);
  });
});

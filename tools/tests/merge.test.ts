import { test, describe, expect } from 'vitest';

import { deepMerge, deepSet } from '../core/merge';

describe('merge', () => {
  test('deepSet', () => {
    const target = { key1: { subkey1: 'Subkey1' } };
    deepSet(target, ['key1', 'subkey2'], 'Subkey2');
    expect(target).toEqual({ key1: { subkey1: 'Subkey1', subkey2: 'Subkey2' } });
  });
  test('deepMerge', () => {
    const target = { key1: { subkey1: 'Subkey1' } };
    const source = { key1: { subkey1: 'NewSubkey1', subkey2: 'Subkey2' } };
    deepMerge(target, source);
    expect(target).toEqual({ key1: { subkey1: 'NewSubkey1', subkey2: 'Subkey2' } });
  });
});

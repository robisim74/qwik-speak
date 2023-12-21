import { test, describe, expect } from 'vitest';

import { deepMerge, deepMergeMissing, deepSet } from '../core/merge';

describe('merge', () => {
  test('deepSet', () => {
    const target = { key1: { subkey1: 'Subkey1' } };
    deepSet(target, ['key1', 'subkey2'], 'Subkey2');
    expect(target).toEqual({ key1: { subkey1: 'Subkey1', subkey2: 'Subkey2' } });
  });
  test('deepMerge', () => {
    // Expect updated value
    const target = { key1: { subkey1: 'Subkey1' } };
    const source = { key1: { subkey1: 'NewSubkey1', subkey2: 'Subkey2' } };
    deepMerge(target, source);
    expect(target).toEqual({ key1: { subkey1: 'NewSubkey1', subkey2: 'Subkey2' } });
    // Expect updated value if target is empty
    const target1 = { key1: '' };
    const source1 = { key1: 'Key1' };
    deepMerge(target1, source1);
    expect(target1).toEqual({ key1: 'Key1' });
    const target2 = { key1: { key2: '' } };
    const source2 = { key1: { key2: [{ subkey1: 'Subkey1', subkey2: 'Subkey2' }] } };
    deepMerge(target2, source2);
    expect(target2).toEqual({ key1: { key2: [{ subkey1: 'Subkey1', subkey2: 'Subkey2' }] } } );
    const target3 = { key1: '' };
    const source3 = { key1: { subkey1: 'Subkey1', subkey2: 'Subkey2' } };
    deepMerge(target3, source3);
    expect(target3).toEqual({ key1: { subkey1: 'Subkey1', subkey2: 'Subkey2' } });
  });
  test('deepMergeMissing', () => {
    // Expect add value
    const target = { key1: { subkey1: 'Subkey1' } };
    const source = { key1: { subkey1: 'NewSubkey1', subkey2: 'Subkey2' } };
    deepMergeMissing(target, source);
    expect(target).toEqual({ key1: { subkey1: 'Subkey1', subkey2: 'Subkey2' } });
    // Expect updated value if target is empty
    const target1 = { key1: '' };
    const source1 = { key1: 'Key1' };
    deepMergeMissing(target1, source1);
    expect(target1).toEqual({ key1: 'Key1' });
    // Expect not updated value if source is empty
    const target2 = { key1: { subkey1: 'Subkey1' } };
    const source2 = { key1: { subkey1: '', subkey2: 'Subkey2' } };
    deepMergeMissing(target2, source2);
    expect(target2).toEqual({ key1: { subkey1: 'Subkey1', subkey2: 'Subkey2' } });
  });
});

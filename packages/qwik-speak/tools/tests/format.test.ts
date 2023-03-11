import { test, describe, expect } from 'vitest';

import { minDepth, sortTarget } from '../core/format';

describe('format', () => {
  test('minDepth', () => {
    let target = {};
    let depth = minDepth(target);
    expect(depth).toBe(0);
    target = { key1: { subkey1: 'Subkey1' }, key2: 'Key2' };
    depth = minDepth(target);
    expect(depth).toBe(1);
    target = { key1: { subkey1: 'Subkey1' }, key2: { subkey2: 'Subkey2' } };
    depth = minDepth(target);
    expect(depth).toBe(2);
  });
  test('sortTarget', () => {
    let target = { b: { b: 'B', a: 'A' }, a: 'A' };
    target = sortTarget(target);
    expect(target).toEqual({ a: 'A', b: { a: 'A', b: 'B' } });
  });
});

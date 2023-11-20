import { test, describe, expect } from 'vitest';

import { sortTarget } from '../core/format';

describe('format', () => {
  test('sortTarget', () => {
    let target = { b: { b: 'B', a: 'A' }, a: 'A' };
    target = sortTarget(target);
    expect(target).toEqual({ a: 'A', b: { a: 'A', b: 'B' } });
  });
});

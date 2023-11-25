import { test, describe, expect } from 'vitest';

import { validateLocale } from '../src';

describe('validateLocale', () => {
  test('langs', () => {
    expect(validateLocale('en')).toBe(true);
    expect(validateLocale('en-US')).toBe(true);
    expect(validateLocale('en-Zzzz-US')).toBe(true);
    expect(validateLocale('en-us')).toBe(false);
  });
});

import { test, describe, expect } from 'vitest';

import { displayName as dn } from '../display-name';
import { ctx } from './config';

describe('displayName function', () => {
  test('display', () => {
    const locale = ctx.locale;
    expect(dn('en-US', { type: 'language' }, locale)).toBe('American English');
    expect(dn('USD', { type: 'currency' }, locale)).toBe('US Dollar');
  });
});

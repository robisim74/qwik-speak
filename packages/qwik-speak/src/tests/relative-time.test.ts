import { test, describe, expect } from 'vitest';

import { relativeTime as rt } from '../relative-time';
import { ctx } from './config';

describe('relativeTime function', () => {
  test('format', () => {
    const locale = ctx.locale;
    expect(rt(-1, 'day', {}, locale)).toBe('1 day ago');
    expect(rt('-1', 'day', { numeric: 'auto', style: 'long' }, locale)).toBe('yesterday');
  });
});

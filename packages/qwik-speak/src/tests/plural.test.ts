import { test, describe, expect } from 'vitest';

import { $plural as p } from '../plural';
import { ctx } from './config';

describe('plural function', () => {
  test('one', () => {
    const value = p(1, '', {}, ctx);
    expect(value).toBe('One software developer');
  });
  test('other', () => {
    const value = p(2, '', {}, ctx);
    expect(value).toBe('2 software developers');
  });
});

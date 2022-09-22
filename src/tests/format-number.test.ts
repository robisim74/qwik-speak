import { formatNumber as fn } from '../library/format-number';
import { ctx } from './config';

describe('formatNumber function', () => {
  test('format', () => {
    const locale = ctx.locale;
    const value = 1234.5;
    expect(fn(value, {}, locale)).toBe('1,234.5');
    expect(fn(value, {
      minimumIntegerDigits: 1,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }, locale)).toBe('1,234.50');
    expect(fn(value, { style: 'currency' }, locale)).toBe('$1,234.50');
    expect(fn(value, { style: 'unit', unit: ctx.locale.units!['length'] }, locale)).toBe('1,234.5 mi');
  });
});

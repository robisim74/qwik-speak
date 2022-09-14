import { formatDate as fd } from '../library/format-date';
import { ctx } from './config';

describe('formatDate function', () => {
  test('format', () => {
    const locale = ctx.locale;
    const value = '2022-07-19T16:30:00Z';
    expect(fd(value, {}, locale)).toBe('7/19/2022');
    expect(fd(value, { dateStyle: 'full' }, locale)).toBe('Tuesday, July 19, 2022');
    expect(fd(value, { dateStyle: 'full', timeStyle: 'short' }, locale)).toBe('Tuesday, July 19, 2022 at 9:30 AM');
  });
});

import { toDate, toNumber } from '../library/utils';

describe('utils', () => {
  test('toNumber', () => {
    expect(toNumber('1234')).toBe(1234);
    expect(toNumber('-1234')).toBe(-1234);
    expect(toNumber(1234)).toBe(1234);
  });
  test('toDate', () => {
    expect(toDate(100000000000)).toEqual(new Date(100000000000));
    expect(toDate('100000000000')).toEqual(new Date(100000000000));
    expect(toDate('2022-07-19')).toEqual(new Date(2022, 6, 19));
    expect(toDate('2022-07-19T16:30:00Z')).toEqual(new Date('2022-07-19T16:30:00Z'));
    expect(toDate(new Date('2022-07-19T16:30:00Z'))).toEqual(new Date('2022-07-19T16:30:00Z'));
  });
});

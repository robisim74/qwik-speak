import { $inline as i } from '../library/inline';

describe('inline function', () => {
  test('default value', () => {
    const value = i('test@@Test');
    expect(value).toBe('Test');
  });
  test('default with params', () => {
    const value = i('test@@Test {{param}}', { param: 'params' });
    expect(value).toBe('Test params');
  });
  test('key', () => {
    const value = i('test');
    expect(value).toBe('test');
  });
});

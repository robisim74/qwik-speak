import { changeLocale } from '../library/change-locale';
import { translate as t } from '../library/translate';
import { ctx } from './config';

describe('translate function', () => {
  test('translate', () => {
    const value = t('test', {}, ctx);
    expect(value).toBe('Test');
  });
  test('translate with params', () => {
    const value = t('testParams', { param: 'params' }, ctx);
    expect(value).toBe('Test params');
  });
  test('translate with array of keys', () => {
    const value = t(['test', 'testParams'], { param: 'params' }, ctx);
    expect(value).toEqual(['Test', 'Test params']);
  });
  test('missing value', () => {
    const value = t('test1', {}, ctx);
    expect(value).toBe('not found');
  });
  test('key separator', () => {
    const value = t('nested.test', {}, ctx);
    expect(value).toBe('Test');
  });
  test('translate when locale changes', async () => {
    await changeLocale({
      lang: 'it-IT',
      currency: 'EUR',
      timeZone: 'Europe/Rome',
      units: {
        'length': 'kilometer'
      }
    }, ctx);
    const value = t('test', {}, ctx);
    expect(value).toBe('Prova');
  });
});

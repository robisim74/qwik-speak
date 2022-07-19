import { changeLocale } from '../library/change-locale';
import { translate as t } from '../library/translate';
import { ctx } from './config';

describe('translate function', () => {
    test('translate', () => {
        let value = t('test', {}, ctx);
        expect(value).toBe('Test');
    });
    test('translate with params', () => {
        let value = t('testParams', { param: 'params' }, ctx);
        expect(value).toBe('Test params');
    });
    test('translate with array of keys', () => {
        let value = t(['test', 'testParams'], { param: 'params' }, ctx);
        expect(value).toEqual({ "test": "Test", "testParams": "Test params" });
    });
    test('translate with language extensions', async () => {
        await changeLocale({ language: 'en-US-u-ca-gregory-nu-latn' }, ctx);
        let value = t('test', {}, ctx);
        expect(value).toBe('Test');
    });
    test('translate when locale changes', async () => {
        await changeLocale({ language: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome', units: { 'length': 'kilometer' } }, ctx);
        let value = t('test', {}, ctx);
        expect(value).toBe('Prova');
    });
});

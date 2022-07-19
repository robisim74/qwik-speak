import { getValue, handleParams, mergeDeep, parseLanguage, toDate, toNumber, validateLanguage } from "../library/utils";

describe('utils', () => {
    describe('mergeDeep', () => {
        test('Object.assign on simple objects', () => {
            const target = { KEY1: 'key1' };
            const source = { KEY2: 'key2' };
            const result = mergeDeep(target, source);
            expect(result).toEqual(Object.assign(target, source));
        });
        test('overwrite the same keys as Object.assign on simple objects', () => {
            const target = { KEY1: 'key1' };
            const source = { KEY1: 'key2' };
            const result = mergeDeep(target, source);
            expect(result).toEqual(Object.assign(target, source));
        });
        test('deeply merge objects correctly', () => {
            const target = { KEY1: 'key1', SUBKEY1: { AA: 'aa' } };
            const source = { KEY2: 'key2', SUBKEY2: { AA: 'aa' } };
            const result = mergeDeep(target, source);
            expect(result).toEqual({
                KEY1: 'key1',
                KEY2: 'key2',
                SUBKEY1: {
                    AA: 'aa'
                },
                SUBKEY2: {
                    AA: 'aa'
                }
            });
        });
        test('deeply merge objects correctly with same sub-key', () => {
            const target = { KEY1: 'key1', SUBKEY1: { AA: 'aa' } };
            const source = { KEY2: 'key2', SUBKEY1: { BB: 'bb' } };
            const result = mergeDeep(target, source);
            expect(result).toEqual({
                KEY1: 'key1',
                KEY2: 'key2',
                SUBKEY1: {
                    AA: 'aa',
                    BB: 'bb'
                }
            });
        });
        test('deeply merge objects correctly with same sub-key and overwrite', () => {
            const target = { KEY1: 'key1', SUBKEY1: { AA: 'aa' } };
            const source = { KEY2: 'key2', SUBKEY1: { AA: 'aaa', BB: 'bb' } };
            const result = mergeDeep(target, source);
            expect(result).toEqual({
                KEY1: 'key1',
                KEY2: 'key2',
                SUBKEY1: {
                    AA: 'aaa',
                    BB: 'bb'
                }
            });
        });
    });
    test('validateLanguage', () => {
        expect(validateLanguage('en')).toBe(true);
        expect(validateLanguage('en-US')).toBe(true);
        expect(validateLanguage('en-Zzzz-US')).toBe(true);
        expect(validateLanguage('en-Zzzz-US-u-nu-latn-ca-gregory')).toBe(true);
        expect(validateLanguage('en-nu-latn')).toBe(false);
    });
    it('parseLanguage', () => {
        let language = parseLanguage('en-Zzzz-US', 'language');
        expect(language).toBe('en');
        language = parseLanguage('en-Zzzz', 'language-script');
        expect(language).toBe('en-Zzzz');
        language = parseLanguage('en-Zzzz-US', 'language-region');
        expect(language).toBe('en-US');
        language = parseLanguage('en-Zzzz-US', 'language-script-region');
        expect(language).toBe('en-Zzzz-US');
        language = parseLanguage('en', 'language');
        expect(language).toBe('en');
        language = parseLanguage('en', 'language-region');
        expect(language).toBe('en');
    });
    test('getValue', () => {
        let value = getValue('KEY1', { KEY1: 'key1', KEY2: 'key2' }, '.');
        expect(value).toBe('key1');
        value = getValue('SUBKEY1.AA', { KEY1: 'key1', SUBKEY1: { AA: 'aa' } }, '.');
        expect(value).toBe('aa');
        value = getValue('SUBKEY1', { KEY1: 'key1', SUBKEY1: { AA: 'aa' } }, '.');
        expect(value).toEqual({ AA: 'aa' });
        value = getValue('SUBKEY1.BB', { KEY1: 'key1', SUBKEY1: { AA: 'aa' } }, '.');
        expect(value).toBeNull();
    });
    test('handleParams', () => {
        let value = handleParams('Test {{param}}', { param: 'params' });
        expect(value).toBe('Test params');
        value = handleParams('Test {{ number }} {{param}}', { number: 2, param: 'params' });
        expect(value).toBe('Test 2 params');
    });
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

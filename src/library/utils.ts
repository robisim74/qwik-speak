import type { Translation, SpeakState, LanguageFormat, Locale } from './types';

export const isObject = (item: any): boolean =>
    typeof item === 'object' && !Array.isArray(item);


export const isDate = (value: any): value is Date =>
    value instanceof Date && !isNaN(value.valueOf());

/**
 * Converts a date in ISO 8601 to a Date.
 */
export const isoStringToDate = (match: RegExpMatchArray): Date => {
    const date = new Date(0);
    let tzHour = 0;
    let tzMin = 0;
    const dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
    const timeSetter = match[8] ? date.setUTCHours : date.setHours;
    if (match[9]) {
        tzHour = Number(match[9] + match[10]);
        tzMin = Number(match[9] + match[11]);
    }
    dateSetter.call(date, Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    const h = Number(match[4] || 0) - tzHour;
    const m = Number(match[5] || 0) - tzMin;
    const s = Number(match[6] || 0);
    const ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
    timeSetter.call(date, h, m, s, ms);
    return date;
}

export const mergeDeep = (target: Translation, source: Translation): Translation => {
    const output = Object.assign({}, target);

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = mergeDeep(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }

    return output;
}

export const addData = (translation: Translation, data: Translation, language: string): void => {
    translation[language] = translation[language] !== undefined
        ? mergeDeep(translation[language], data)
        : data;
}

export const loadTranslation = async (locale: Partial<Locale>, ctx: SpeakState, assets?: Array<string | Translation>): Promise<Translation> => {
    const { config, translateFn } = ctx;
    if (!locale.language) return {};

    const language = parseLanguage(locale.language, config.languageFormat);

    assets = assets ?? config.assets;
    // Get translation
    const tasks = assets.map(asset => translateFn.getTranslation$?.(language, asset));
    const results = await Promise.all(tasks);

    const newTranslation: Translation = {};
    results.forEach(data => {
        if (data) {
            addData(newTranslation, data, language)
        }
    });
    return newTranslation;
}

export const speakError = (type: Function, value: string): Error => {
    return new Error(`Qwik Speak (${type.name}): ${value}`);
}

export const validateLanguage = (language: string): boolean => {
    const regExp = new RegExp(/^([a-z]{2,3})(-[A-Z][a-z]{3})?(-[A-Z]{2})?(-u.+)?$/);
    return regExp.test(language);
}

export const parseLanguage = (language: string, format: LanguageFormat): string => {
    if (!validateLanguage(language)) throw speakError(parseLanguage, 'Invalid language');

    const [, LANGUAGE = '', SCRIPT = '', REGION = ''] = language.match(/^([a-z]{2,3})(-[A-Z][a-z]{3})?(-[A-Z]{2})?/) || [];
    switch (format) {
        case 'language':
            return LANGUAGE;
        case 'language-script':
            return LANGUAGE + SCRIPT;
        case 'language-region':
            return LANGUAGE + REGION;
        case 'language-script-region':
            return LANGUAGE + SCRIPT + REGION;
    }
}

export const getValue = (key: string, data: Translation, keySeparator = '.'): string | any => {
    if (data) {
        if (keySeparator) {
            return key.split(keySeparator).reduce((acc, cur) => (acc && acc[cur]) != null ? acc[cur] : null, data);
        }
        return data[key] != null ? data[key] : null;
    }
    return null;
}

export const handleParams = (value: string, params: any): string => {
    const replacedValue = value.replace(/{{\s?([^{}\s]*)\s?}}/g, (substring: string, parsedKey: string) => {
        const replacer = params[parsedKey];
        return replacer !== undefined ? replacer : substring;
    });
    return replacedValue;
}

export const toNumber = (value: any): number => {
    const parsedValue = typeof value === 'string' && !isNaN(+value - parseFloat(value)) ? +value : value;
    return parsedValue;
}

export const toDate = (value: any): Date => {
    if (isDate(value)) {
        return value;
    }

    if (typeof value === 'number' && !isNaN(value)) {
        return new Date(value);
    }
    if (typeof value === 'string') {
        value = value.trim();
        if (!isNaN(value - parseFloat(value))) {
            return new Date(parseFloat(value));
        }
        if (/^(\d{4}-\d{1,2}-\d{1,2})$/.test(value)) {
            const [y, m, d] = value.split('-').map((val: string) => +val);
            return new Date(y, m - 1, d);
        }
        const match = value.match(/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/);
        if (match) {
            return isoStringToDate(match);
        }
    }

    const date = new Date(value as any);
    if (!isDate(date)) {
        throw speakError(toDate, 'Invalid date');
    }
    return date;
}

export const qDev = (globalThis as any).qDev !== false;

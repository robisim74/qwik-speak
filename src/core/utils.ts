import type { Translation, SpeakState, LanguageFormat, Locale } from './types';

export const isObject = (item: any): boolean => {
    return typeof item === 'object' && !Array.isArray(item);
}

export const mergeDeep = (target: Translation, source: Translation): Translation | void => {
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

export const getTranslation = async (locale: Locale, speakContext: SpeakState): Promise<void> => {
    const { translation, config, translateFn } = speakContext;

    const language = parseLanguage(locale.language, config.languageFormat);

    let tasks = [];
    if (Array.isArray(config.assets)) {
        tasks = config.assets.map(asset => translateFn.loadTranslation$?.(language, asset))
    } else {
        tasks = [translateFn.loadTranslation$?.(language, config.assets)];
    }
    const data = await Promise.all(tasks);

    data.forEach(value => {
        if (value) {
            addData(translation, value, language)
        }
    });
}

export const speakError = (type: Function, value: string): Error => {
    return new Error(`Qwuik Speak (${type.name}): ${value}`);
}

export const validateLanguage = (language: string): boolean => {
    const regExp = new RegExp(/^([a-z]{2,3})(\-[A-Z][a-z]{3})?(\-[A-Z]{2})?(-u.+)?$/);
    return regExp.test(language);
}

export const parseLanguage = (language: string, format: LanguageFormat): string => {
    if (language == null || language === '') return '';
    if (!validateLanguage(language)) throw speakError(parseLanguage, 'Invalid language');

    const [, LANGUAGE = '', SCRIPT = '', REGION = ''] = language.match(/^([a-z]{2,3})(\-[A-Z][a-z]{3})?(\-[A-Z]{2})?/) || [];
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

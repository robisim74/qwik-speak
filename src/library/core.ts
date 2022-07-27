import type { Translation, SpeakState, LanguageFormat, TranslateFn, Locale, SpeakConfig } from './types';
import { isObject, speakError } from './utils';

/**
 * Resolve the locale to be used
 */
export const resolveLocale = async (translateFn: TranslateFn, config: SpeakConfig): Promise<Locale> => {
    // From storage
    let userLocale = await translateFn.getLocale$?.();

    // By user language
    if (!userLocale) {
        const userLanguage = await translateFn.getUserLanguage$?.();
        userLocale = config.supportedLocales.find(x => formatLanguage(x.language, config.languageFormat) == userLanguage);
    }

    // Fallback to default locale
    if (!userLocale) {
        userLocale = config.defaultLocale;
    }

    return userLocale;
}

/**
 * Load translation data for the language
 */
export const loadTranslation = async (language: string, ctx: SpeakState, assets?: Array<string | Translation>): Promise<Translation> => {
    const { config, translateFn } = ctx;

    language = formatLanguage(language, config.languageFormat);

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
};

export const addData = (translation: Translation, data: Translation, language: string): void => {
    translation[language] = translation[language] !== undefined
        ? mergeDeep(translation[language], data)
        : data;
};

/**
 * Merge translation data
 */
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
};

/**
 * Get value of the key
 */
export const getValue = (key: string, data: Translation, keySeparator = '.'): string | any => {
    if (data) {
        if (keySeparator) {
            return key.split(keySeparator).reduce((acc, cur) => (acc && acc[cur]) != null ? acc[cur] : null, data);
        }
        return data[key] != null ? data[key] : null;
    }
    return null;
};

/**
 * Replace params in the value
 */
export const handleParams = (value: string, params: any): string => {
    const replacedValue = value.replace(/{{\s?([^{}\s]*)\s?}}/g, (substring: string, parsedKey: string) => {
        const replacer = params[parsedKey];
        return replacer !== undefined ? replacer : substring;
    });
    return replacedValue;
};

export const validateLanguage = (language: string): boolean => {
    const regExp = new RegExp(/^([a-z]{2,3})(-[A-Z][a-z]{3})?(-[A-Z]{2})?(-u.+)?$/);
    return regExp.test(language);
};

/**
 * Format the language according to the config format
 */
export const formatLanguage = (language: string, format: LanguageFormat): string => {
    if (!validateLanguage(language)) throw speakError(formatLanguage, 'Invalid language');

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
};

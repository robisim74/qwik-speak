import type { Translation, TranslationConfig } from './types';

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

export const getTranslation = async (language: string, config: TranslationConfig, translation: Translation): Promise<void> => {
    let tasks = [];
    if (Array.isArray(config.assets)) {
        tasks = config.assets.map(asset => config.translationFn?.loadTranslation?.invoke(language, asset))
    } else {
        tasks = [config.translationFn?.loadTranslation?.invoke(language, config.assets)];
    }
    const data = await Promise.all(tasks);

    data.forEach(value => {
        if (value) {
            addData(translation, value, language)
        }
    });
}

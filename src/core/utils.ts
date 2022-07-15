import type { Translation, SpeakState } from './types';

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

export const getTranslation = async (language: string, speakContext: SpeakState): Promise<void> => {
    const { translation, config, translateFn } = speakContext;

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

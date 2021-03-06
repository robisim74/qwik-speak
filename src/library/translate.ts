import { useContext } from '@builder.io/qwik';

import type { SpeakState } from './types';
import { SpeakContext } from './constants';
import { getValue, handleParams, parseLanguage } from './utils';

/**
 * Translate a key or an array of keys
 * @param keys The key or an array of keys to be translated
 * @param params Optional parameters contained in the value
 * @param ctx 
 * @param language 
 * @returns The translated value or an object: {key: value}
 */
export const translate = (keys: string | string[], params?: any, ctx?: SpeakState, language?: string): string | any => {
    ctx = ctx ?? useContext(SpeakContext);
    const { locale, translation, config, translateFn } = ctx;

    language = language ?? locale.language;
    if (!language) return keys;

    language = parseLanguage(language, config.languageFormat);

    if (Array.isArray(keys)) {
        const data: { [key: string]: any } = {};
        for (const key of keys) {
            data[key] = translate(key, params, ctx, language);
        }
        return data;
    }

    const value = getValue(keys, translation[language], config.keySeparator);

    return value ? handleParams(value, params) : translateFn.handleMissingTranslation$?.(keys, value, params);
}

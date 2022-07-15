import { useContext } from '@builder.io/qwik';

import type { SpeakState } from './types';
import { SpeakContext } from './constants';
import { getValue, handleParams, parseLanguage } from './utils';

/**
 * Translate a key or an array of keys
 * @param keys The key or an array of keys to be translated
 * @param params Optional parameters contained in the value
 * @param speakContext Optional speak context if not available
 * @param language Optional language to be used
 * @returns The translated value or an object: {key: value}
 */
export const translate = (keys: string | string[], params?: any, speakContext?: SpeakState, language?: string): string | any => {
    speakContext = speakContext ?? useContext(SpeakContext);
    const { locale, translation, config, translateFn } = speakContext;

    language = language ?? locale.language!;
    language = parseLanguage(language, config.languageFormat);

    if (Array.isArray(keys)) {
        const data: { [key: string]: any } = {};
        for (const key of keys) {
            data[key] = translate(key, params, speakContext, language);
        }
        return data;
    }

    const value = getValue(keys, translation[language], config.keySeparator);

    return value ? handleParams(value, params) : translateFn.handleMissingTranslation$?.(keys, value, params);
}
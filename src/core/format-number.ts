import { useContext } from '@builder.io/qwik';

import type { ConvertFn, SpeakState } from './types';
import { SpeakContext } from './constants';
import { toNumber } from './utils';

const format = (value: any, options?: Intl.NumberFormatOptions, convert?: ConvertFn, convertParams?: any, speakContext?: SpeakState, language?: string, currency?: string): string => {
    speakContext = speakContext ?? useContext(SpeakContext);
    const { locale } = speakContext;

    language = language ?? locale.language;
    currency = currency ?? locale.currency;

    value = toNumber(value);

    if (typeof convert === 'function') {
        value = convert(value, convertParams || {});
    }

    options = { ...options };
    if (currency) options.currency = currency;

    return new Intl.NumberFormat(language, options).format(value);
}

/**
 * Format a number
 * @param value A number or a string
 * @param options Intl NumberFormatOptions object
 * @param speakContext 
 * @param language 
 * @param currency 
 * @returns 
 */
export const formatNumber = (value: any, options?: Intl.NumberFormatOptions, speakContext?: SpeakState, language?: string, currency?: string): string => {
    return format(value, options, undefined, undefined, speakContext, language, currency);
}

/**
 * Convert & format a number
 * @param value A number or a string
 * @param options Intl NumberFormatOptions object
 * @param convert A function to convert the value, with optional params in the signature
 * For example:
 * ```
 * const convert = (value: number, params: any) => { return ... };
 * ```
 * @param convertParams Optional parameters for the convert function, e.g.: { rate: ... } 
 * @param speakContext 
 * @param language 
 * @param currency 
 * @returns 
 */
export const convertNumber = (value: any, options?: Intl.NumberFormatOptions, convert?: ConvertFn, convertParams?: any, speakContext?: SpeakState, language?: string, currency?: string): string => {
    return format(value, options, convert, convertParams, speakContext, language, currency);
}

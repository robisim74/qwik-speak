import { useContext } from '@builder.io/qwik';

import type { SpeakState } from './types';
import { SpeakContext } from './constants';
import { toNumber } from './utils';

/**
 * Format a number
 * @param value A number or a string
 * @param options Intl NumberFormatOptions object
 * @param ctx 
 * @param language 
 * @param currency 
 * @returns 
 */
export const formatNumber = (value: any, options?: Intl.NumberFormatOptions, ctx?: SpeakState, language?: string, currency?: string): string => {
    ctx = ctx ?? useContext(SpeakContext);
    const { locale } = ctx;

    language = language ?? locale.language;
    currency = currency ?? locale.currency;

    value = toNumber(value);

    options = { ...options };
    if (currency) options.currency = currency;

    return new Intl.NumberFormat(language, options).format(value);
}

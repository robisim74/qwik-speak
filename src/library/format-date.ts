import { useContext } from '@builder.io/qwik';

import type { SpeakState } from './types';
import { SpeakContext } from './constants';
import { toDate } from './utils';

/**
 * Format a date
 * @param value A date, a number (milliseconds since UTC epoch) or an ISO 8601 string
 * @param options Intl DateTimeFormatOptions object
 * @param ctx 
 * @param language 
 * @param timeZone 
 * @returns 
 */
export const formatDate = (value: any, options?: Intl.DateTimeFormatOptions, ctx?: SpeakState, language?: string, timeZone?: string): string => {
    ctx = ctx ?? useContext(SpeakContext);
    const { locale } = ctx;

    language = language ?? locale.language;
    timeZone = timeZone ?? locale.timeZone;

    value = toDate(value);

    options = { ...options };
    if (timeZone) options.timeZone = timeZone;

    return new Intl.DateTimeFormat(language, options).format(value);
}

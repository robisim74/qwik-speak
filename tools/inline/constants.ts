/**
 * s modifier: single line. Dot matches newline characters
 */
export const translateFnTest = /\$translate\(.*?\)/s;
export const translateFnMatch = /\$translate\(.*?\)/gs;
export const translateFnSignatureMatch = /(?<=^\$translate\().*?(?=\)$)/s;

/**
 * globalThis.$lang
 */
export const globalLang = '$lang';

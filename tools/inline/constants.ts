/**
 * s modifier: single line. Dot matches newline characters
 */
export const translateFnTest = /(\$translate|\$inline)\(("|'|`).*?("|'|`).*?\)/s;
export const translateFnMatch = /(\$translate|\$inline)\(("|'|`).*?("|'|`).*?\)/gs;
export const translateFnSignatureMatch = /(?<=^(\$translate|\$inline)\()("|'|`).*?("|'|`).*?(?=\)$)/gs;

/**
 * globalThis.$lang
 */
export const globalLang = '$lang';

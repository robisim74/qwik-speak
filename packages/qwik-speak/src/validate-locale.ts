/**
 * Validate language[-script][-region]
 * - `language` ISO 639 two-letter or three-letter code
 * - `script` ISO 15924 four-letter script code
 * - `region` ISO 3166 two-letter, uppercase code
 */
export const validateLocale = (lang: string): boolean => {
    return /^([a-z]{2,3})(-[A-Z][a-z]{3})?(-[A-Z]{2})?$/.test(lang);
};

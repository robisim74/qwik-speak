import { useSpeakLocale } from './use-functions';

export const $lang = (lang: string): boolean => useSpeakLocale().lang === lang;

export const $rule = (
  lang: string,
  value: number | string,
  rule: string,
  options?: Intl.PluralRulesOptions,
): boolean => new Intl.PluralRules(lang, options).select(+value) === rule;

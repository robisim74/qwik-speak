export const $rule = (
  lang: string,
  value: number | string,
  rule: string,
  options?: Intl.PluralRulesOptions,
): boolean => new Intl.PluralRules(lang, options).select(+value) === rule;

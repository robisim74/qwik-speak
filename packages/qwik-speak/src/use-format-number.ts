import { useSpeakLocale } from './use-speak';

export type FormatNumberFn = {
  /**
   * Format a number
   * @param value A number or a string
   * @param options Intl NumberFormatOptions object
   * @param lang Optional language if different from the current one
   * @param currency Optional currency if different from the current one
   * @returns The formatted number
   */
  (value: number | string, options?: Intl.NumberFormatOptions, lang?: string, currency?: string): string;
};

export const useFormatNumber = (
  value: number | string,
  options?: Intl.NumberFormatOptions,
  lang?: string,
  currency?: string
) => {
  const locale = useSpeakLocale();

  lang ??= locale.extension ?? locale.lang;
  currency ??= locale.currency;

  value = +value;

  options = { ...options };
  if (currency) options.currency = currency;

  return new Intl.NumberFormat(lang, options).format(value);
};

export { useFormatNumber as formatNumber };

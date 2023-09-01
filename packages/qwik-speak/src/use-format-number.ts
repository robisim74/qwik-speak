import { noSerialize } from '@builder.io/qwik';
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

export const useFormatNumber = () => {
  const locale = useSpeakLocale();

  const formatNumber = (
    value: number | string,
    options?: Intl.NumberFormatOptions,
    lang?: string,
    currency?: string
  ) => {
    lang ??= locale.extension ?? locale.lang;
    currency = currency ?? locale.currency;

    value = +value;

    options = { ...options };
    if (currency) options.currency = currency;

    return new Intl.NumberFormat(lang, options).format(value);
  };

  return noSerialize(formatNumber) as FormatNumberFn;
};

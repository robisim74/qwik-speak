import { noSerialize } from '@builder.io/qwik';
import { useSpeakLocale } from './use-speak';

export type RelativeTimeFn = {
  /**
   * Format a relative time
   * @param value A number or a string
   * @param unit Intl RelativeTimeFormatUnit string
   * @param options Intl RelativeTimeFormatOptions object
   * @param lang Optional language if different from the current one
   */
  (
    value: number | string,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
    lang?: string
  ): string;
};

export const useRelativeTime = () => {
  const locale = useSpeakLocale();

  const relativeTime = (
    value: number | string,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
    lang?: string
  ) => {
    lang ??= locale.extension ?? locale.lang;

    value = +value;

    return new Intl.RelativeTimeFormat(lang, options).format(value, unit);
  };

  return noSerialize(relativeTime) as RelativeTimeFn;
};

import { useSpeakLocale } from './use-functions';

export type FormatDateFn = {
  /**
   * Format a date
   * @param value A date, a number (milliseconds since UTC epoch) or a string
   * @param options Intl DateTimeFormatOptions object
   * @param lang Optional language if different from the current one
   * @param timeZone Optional time zone if different from the current one
   * @returns The formatted date
   */
  (value: Date | number | string, options?: Intl.DateTimeFormatOptions, lang?: string, timeZone?: string): string;
};

export const useFormatDate = (): FormatDateFn => {
  const locale = useSpeakLocale();

  const formateDate = (
    value: Date | number | string,
    options?: Intl.DateTimeFormatOptions,
    lang?: string,
    timeZone?: string
  ) => {
    lang ??= locale.extension ?? locale.lang;
    timeZone = timeZone ?? locale.timeZone;

    value = new Date(value);

    options = { ...options };
    if (timeZone) options.timeZone = timeZone;

    return new Intl.DateTimeFormat(lang, options).format(value);
  };

  return formateDate as FormatDateFn;
};

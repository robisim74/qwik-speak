import { QRL, ValueOrPromise } from '@builder.io/qwik';

export interface SpeakLocale {
  /**
   * language[-script][-region]
   * Where:
   * - language: ISO 639 two-letter or three-letter code
   * - script: ISO 15924 four-letter script code
   * - region: ISO 3166 two-letter, uppercase code
   */
  lang: string;
  /**
   * Language with Intl extensions
   * language[-script][-region][-extensions]
   */
  extension?: string;
  /**
   * ISO 4217 three-letter code
   */
  currency?: string;
  /**
   * Time zone name from the IANA time zone database
   */
  timeZone?: string;
  /**
   * Key value pairs of unit identifiers
   */
  units?: { [key: string]: string };
}

/**
 * Translation data
 */
export type Translation = { [key: string]: any };

/**
 * Must contain the logic to load translation data
 */
export type LoadTranslationFn = QRL<(lang: string, asset: string, origin?: string) =>
  ValueOrPromise<Translation | null>>;

/**
 * Must contain the logic to resolve which locale to use during SSR
 */
export type ResolveLocaleFn = QRL<(url: URL) => ValueOrPromise<SpeakLocale | null | undefined>>;

export interface TranslateFn {
  /**
   * Function to load translation data
   */
  loadTranslation$?: LoadTranslationFn;
  /**
   * Function to resolve which locale to use during SSR
   */
  resolveLocale$?: ResolveLocaleFn;
}

export interface SpeakConfig {
  /**
   * The default locale
   */
  defaultLocale: SpeakLocale;
  /**
   * Supported locales
   */
  supportedLocales: SpeakLocale[];
  /**
   * Assets to load
   */
  assets: string[];
  /**
   * Separator of nested keys. Default is '.'
   */
  keySeparator?: string;
  /**
   * Key-value separator. Default is '@@'
   */
  keyValueSeparator?: string;
}

export interface InternalSpeakState {
  /**
   * Current locale
   */
  locale: Partial<SpeakLocale>;
  /**
   * Translation data
   */
  translation: Translation;
  /***
   * Speak configuration
   */
  config: SpeakConfig;
  /**
   * Functions to use
   */
  translateFn: TranslateFn;
}

/**
 * Speak state
 */
export interface SpeakState extends InternalSpeakState {
  locale: SpeakLocale;
  translateFn: Required<TranslateFn>;
}

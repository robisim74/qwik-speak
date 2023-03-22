import type { QRL, ValueOrPromise } from '@builder.io/qwik';

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

export interface TranslationFn {
  /**
   * Function to load translation data
   */
  loadTranslation$: LoadTranslationFn;
}

export interface SpeakConfig {
  /**
   * The default locale to use as fallback
   */
  defaultLocale: SpeakLocale;
  /**
   * List of locales supported by the app
   */
  supportedLocales: SpeakLocale[];
  /**
   * An array of strings: each asset is passed to the loadTranslation$ function to obtain data according to the language
   */
  assets: string[];
  /**
   * Optional assets available at runtime
   */
  runtimeAssets?: string[];
  /**
   * Separator of nested keys. Default is '.'
   */
  keySeparator?: string;
  /**
   * Key-value separator. Default is '@@'
   */
  keyValueSeparator?: string;
}

export interface SpeakState {
  /**
   * Current locale
   */
  locale: SpeakLocale;
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
  translationFn: TranslationFn;
}

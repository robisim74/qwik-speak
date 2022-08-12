import { QRL, ValueOrPromise } from '@builder.io/qwik';
import { RouteLocation } from '@builder.io/qwik-city';

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
 * Must contain the logic to get translation data
 */
export type GetTranslationFn = QRL<(lang: string, asset: string | Translation, location?: RouteLocation)
  => ValueOrPromise<Translation>>;

/**
 * Must contain the logic to resolve which locale to use during SSR
 */
export type ResolveLocaleFn = QRL<(location?: RouteLocation, endpointData?: any)
  => ValueOrPromise<SpeakLocale | null | undefined>>;

/**
 * Must contain the logic to store the locale on Client when changes
 */
export type StoreLocaleFn = QRL<(locale: SpeakLocale) => ValueOrPromise<void>>;

/**
 * Must contain the logic to handle missing values
 */
export type HandleMissingTranslationFn = QRL<(key: string, value?: string, params?: any, ctx?: SpeakState) => any>;

export interface TranslateFn {
  /**
   * Function to get translation data
   */
  getTranslation$?: GetTranslationFn;
  /**
   * Function to resolve which locale to use during SSR
   */
  resolveLocale$?: ResolveLocaleFn;
  /**
   * Function to store the locale on Client
   */
  storeLocale$?: StoreLocaleFn;
  /**
   * Function to handle missing values
   */
  handleMissingTranslation$?: HandleMissingTranslationFn;
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
   * Assets to load or translation data
   */
  assets: Array<string | Translation>;
  /**
   * Separator of nested keys
   */
  keySeparator?: string;
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
export interface SpeakState extends Omit<InternalSpeakState, '$flags$'> {
  locale: SpeakLocale;
  translateFn: Required<TranslateFn>;
}

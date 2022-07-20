import { QRL, ValueOrPromise } from '@builder.io/qwik';

export interface Locale {
    /**
     * language[-script][-region][-extension]
     * Where:
     * - language: ISO 639 two-letter or three-letter code
     * - script: ISO 15924 four-letter script code
     * - region: ISO 3166 two-letter, uppercase code
     * - extension: 'u' (Unicode) extensions
     */
    language: string;
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
    units?: { [key: string]: string }
}

/**
 * Translation data
 */
export type Translation = { [key: string]: any };

export type LanguageFormat = 'language' | 'language-script' | 'language-region' | 'language-script-region';

/**
 * Must contain the logic to get translation data
 * 
 * Function passing across serializable boundaries must be done through QRLs
 */
export type GetTranslationFn = QRL<(language: string, asset: string | Translation) => ValueOrPromise<Translation>>;

/**
 * Must contain the logic to get the user language
 */
export type GetUserLanguageFn = QRL<() => ValueOrPromise<string | null>>;

/**
 * Must contain the logic to store the locale
 */
export type SetLocaleFn = QRL<(locale: Partial<Locale>) => ValueOrPromise<void>>;

/**
* Must contain the logic to get the locale from the storage
*/
export type GetLocaleFn = QRL<() => ValueOrPromise<Locale | null>>;

/**
* Must contain the logic to handle missing values
*/
export type HandleMissingTranslationFn = QRL<(key: string, value?: string, params?: any) => string | any>;


export interface TranslateFn {
    /**
     * Function to get translation data
     */
    getTranslation$?: GetTranslationFn;
    /**
     * Function to get user language
     */
    getUserLanguage$?: GetUserLanguageFn;
    /**
     * Function to store the locale
     */
    setLocale$?: SetLocaleFn;
    /**
     * Function to get the locale from the storage
     */
    getLocale$?: GetLocaleFn;
    /**
     * Function to create an handler for missing values
     */
    handleMissingTranslation$?: HandleMissingTranslationFn;
}

export interface SpeakConfig {
    /**
     * Format of the translation language. Pattern: 'language[-script][-region]'
     * e.g.
     * languageFormat: 'language-region';
     */
    languageFormat: LanguageFormat;
    /**
     * Separator of nested keys
     */
    keySeparator?: string;
    /**
     * The default locale to be used as fallback
     * e.g.
     * defaultLocale: { language: 'en-US' };
     */
    defaultLocale: Locale;
    /**
     * Supported locales
     */
    supportedLocales: Locale[];
    /**
     * Assets to be loaded or translation data
     */
    assets: Array<string | Translation>,
}

/**
 * Speak state
 */
export interface SpeakState {
    /**
     * Current locale
     */
    locale: Partial<Locale>,
    /**
     * Translation data
     */
    translation: Translation,
    /***
     * Speak configuration
     */
    config: SpeakConfig
    /**
     * Functions to be used
     */
    translateFn: TranslateFn,
}

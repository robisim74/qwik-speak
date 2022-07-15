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
export type LoadTranslationFn = QRL<(language: string, asset: string | Translation) => ValueOrPromise<Translation>>;

/**
 * Must contain the logic to get the user language
 */
export type GetUserLanguageFn = QRL<() => ValueOrPromise<string | null>>;

/**
 * Must contain the logic to store the locale
 */
export type WriteLocaleFn = QRL<(locale: Locale) => ValueOrPromise<void>>;

/**
* Must contain the logic to read the locale from the storage
*/
export type ReadLocaleFn = QRL<() => ValueOrPromise<Locale | null>>;

export interface TranslateFn {
    /**
     * Function to load translation data
     */
    loadTranslation$?: LoadTranslationFn;
    /**
     * Function to get user language
     */
    getUserLanguage$?: GetUserLanguageFn;
    /**
     * Function to store the locale
     */
    writeLocale$?: WriteLocaleFn;
    /**
     * Function to read the locale from the storage
     */
    readLocale$?: ReadLocaleFn;
}

export interface SpeakConfig {
    /**
     * Format of the translation language. Pattern: 'language[-script][-region]'
     * E.g.
     * languageFormat: 'language-region';
     */
    languageFormat: LanguageFormat;
    /**
     * Separator of nested keys
     */
    keySeparator?: string;
    /**
     * The default locale to be used as fallback
     * E.g.
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
    assets: string[] | Translation,
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

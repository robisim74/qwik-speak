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
export type LoadTranslationFn = QRL<(language: string, assets?: string) => ValueOrPromise<Translation>>;

export interface TranslationFn {
    /**
     * Function to load translation data
     */
    loadTranslation?: LoadTranslationFn;
}

export interface TranslationConfig {
    /**
     * Format of the translation language. Pattern: 'language[-script][-region]'
     * E.g.
     * languageFormat: 'language-region';
     */
    languageFormat: LanguageFormat;
    /**
     * Separator of nested keys
     */
    keySeparator: string;
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
     * Assets to be loaded
     */
    assets?: string[],
    /**
     * Functions to be used
     */
    token?: TranslationFn,
}

/**
 * Translation state context
 */
export interface TranslationState {
    /**
     * Current locale
     */
    locale: Locale,
    /**
     * Translation data
     */
    translation: Translation,
    /***
     * Translation configuration
     */
    config: TranslationConfig
}

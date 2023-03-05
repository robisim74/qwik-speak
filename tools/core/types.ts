/**
 * Qwik Speak Extract Options
 */
export interface QwikSpeakExtractOptions {
  /**
   * The base path. Default to './'
   */
  basePath?: string;
  /**
   * Path to files to search for translations. Default to 'src'
   */
  sourceFilesPath?: string;
  /**
   * Paths to exclude
   */
  excludedPaths?: string[];
  /**
   * Path to translation files: [basePath]/[assetsPath]/[lang]/*.json. Default to 'public/i18n'
   */
  assetsPath?: string;
  /**
   * The format of the translation files. Default to 'json'
   */
  format?: 'json';
  /**
   * Supported langs. Required
   */
  supportedLangs: string[];
  /**
   * Separator of nested keys. Default is '.'
   */
  keySeparator?: string;
  /**
   * Key-value separator. Default is '@@'
   */
  keyValueSeparator?: string;
}

/**
 * Qwik Speak Inline Vite Plugin Options
 */
export interface QwikSpeakInlineOptions {
  /**
   * The base path. Default to './'
   */
  basePath?: string;
  /**
   * Path to translation files: [basePath]/[assetsPath]/[lang]/*.json. Default to 'public/i18n'
   */
  assetsPath?: string;
  /**
   * Supported langs. Required
   */
  supportedLangs: string[];
  /**
   * Default lang. Required
   */
  defaultLang: string;
  /**
   * Separator of nested keys. Default is '.'
   */
  keySeparator?: string;
  /**
   * Key-value separator. Default is '@@'
   */
  keyValueSeparator?: string;
  /**
   * If true, split chunks by lang
   */
  splitChunks?: boolean;
}

/**
 * Translation data
 */
export type Translation = { [key: string]: any };

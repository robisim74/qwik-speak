/**
 * Qwik Speak Extract Options
 */
export interface QwikSpeakExtractOptions {
  /**
   * The base path. Default to './'
   */
  basePath?: string;
  /**
   * Paths to files to search for translations. Default to 'src'
   */
  sourceFilesPaths?: string[];
  /**
   * Paths to exclude
   */
  excludedPaths?: string[];
  /**
   * Path to translation files: [basePath]/[assetsPath]/[lang]/*.json. Default to 'i18n'
   */
  assetsPath?: string;
  /**
   * The format of the translation files. Default to 'json'
   */
  format?: 'json';
  /**
   * Filename for not scoped translations. Default is 'app'
   */
  filename?: string;
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
   * Path to translation files: [basePath]/[assetsPath]/[lang]/*.json. Default to 'i18n'
   */
  assetsPath?: string;
  /**
   * The build output directory. Default to 'dist'
   */
  outDir?: string;
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
}

/**
 * Translation data
 */
export type Translation = { [key: string]: any };

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
   * Optional function to implement a fallback strategy
   */
  fallback?: (translation: Translation) => Translation;
  /**
   * Separator of nested keys. Default is '.'
   */
  keySeparator?: string;
  /**
   * Key-value separator. Default is '@@'
   */
  keyValueSeparator?: string;
  /**
   * Automatically handle keys for each string. Default is false.
   * Make sure to set autoKeys: true in the vite plugin options for qwik inline
   */
  autoKeys?: boolean;
  /**
   * Automatically remove unused keys from assets,
   * except in runtime assets
   */
  unusedKeys?: boolean;
  /**
   * Comma-separated list of runtime assets to preserve
   */
  runtimeAssets?: string[];
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
   * Optional function to load asset by lang
   */
  loadAssets?: (lang: string) => Promise<Translation>;
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
  /**
   * Automatically handle keys for each string. Default is false.
   * Make sure to enable --autoKeys=true when running the extractor
   */
  autoKeys?: boolean;
}

/**
 * Translation data
 */
export type Translation = { [key: string]: any };

export interface RewriteRouteOption {
  /**
   * Optional prefix
   */
  prefix?: string;
  /**
   * Translated segments.
   * Key value pairs: folder name - translated value
   */
  paths: Record<string, string>;
  /**
   * In domain-based routing, set the default domain for the prefix
   */
  domain?: string;
  /**
   * In domain-based routing, set another domain for the prefix
   */
  withDomain?: string;
}

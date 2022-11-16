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

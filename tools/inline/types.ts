export type Format = 'json';

export interface QwikSpeakInlineVitePluginOptions {
  /**
   * The base path. Default to './'
   */
  basePath: string;
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
}

/**
 * Translation data
 */
export type Translation = { [key: string]: any };

export type Format = 'json';

export interface QwikSpeakInlineVitePluginOptions {
  /**
   * Alias for $translate, Default to '$translate'.
   * E.g. import { $translate as t } from 'qwik-speak'
   */
  $translateAlias?: string;
  /**
   * Directory of the translation assets. Default to `public/i18n`
   */
  assetsDir?: string;
  /**
   * The format of the translation files. Default to 'json'
   */
  format?: Format;
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

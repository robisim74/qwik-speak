import { getLang, getSpeakContext } from './context';

export type LocalizePathFn = {
  /**
   * Localize a path with the language
   * @param pathname The path to localize
   * @param lang Optional language if different from the default one
   * @returns The localized path
   */
  (pathname: string, lang?: string): string;
  /**
   * Localize an url with the language
   * @param url The url to localize
   * @param lang Optional language if different from the default one
   * @returns The localized url
   */
  (url: URL, lang?: string): string;
  /**
   * Localize an array of paths with the language
   * @param pathnames The array of paths to localize
   * @param lang Optional language if different from the default one
   * @returns The localized paths
   */
  (pathnames: string[], lang?: string): string[];
};

export const localizePath = (): LocalizePathFn => {
  const currentLang = getLang();

  const getRegEpx = (lang: string) => new RegExp(`(/${lang}/)|(/${lang}$)|(/(${lang})(?=\\?))`);

  const replace = (pathname: string, lang?: string) => {
    const { config } = getSpeakContext();

    lang ??= currentLang;

    const langParam = config.supportedLocales.find(locale => getRegEpx(locale.lang)?.test(pathname))?.lang;
    if (langParam) {
      if (lang !== config.defaultLocale.lang) {
        pathname = pathname.replace(langParam, lang);
      } else {
        pathname = pathname.replace(getRegEpx(langParam), '/');
      }
    } else if (lang !== config.defaultLocale.lang) {
      pathname = `/${lang}${pathname}`;
    }

    return pathname;
  };

  const localize = (route: (string | URL) | string[], lang?: string) => {
    if (Array.isArray(route)) {
      return route.map(path => replace(path, lang));
    }

    if (typeof route === 'string') {
      return replace(route, lang);
    }

    route.pathname = replace(route.pathname, lang);

    return route.toString().replace(/\/\?/, '?');
  };

  return localize as LocalizePathFn;
};

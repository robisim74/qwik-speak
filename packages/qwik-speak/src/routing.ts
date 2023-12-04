import { isDev } from '@builder.io/qwik/build';

import type { SpeakLocale } from './types';
import { getLang, getSpeakContext } from './context';
import { logWarn } from './log';

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

export type TranslatePathFn = {
  /**
   * Translate a path
   * @param pathname The path to translate
   * @param lang Optional language if different from the default one
   * @returns The translation or the path if not found
   */
  (pathname: string, lang?: string): string;
  /**
   * Translate an url
   * @param url The url to translate
   * @param lang Optional language if different from the default one
   * @returns The translation or the url if not found
   */
  (url: URL, lang?: string): string;
  /**
   * Translate an array of paths
   * @param pathname The array of paths to translate
   * @param lang Optional language if different from the default one
   * @returns The translations or the paths if not found
   */
  (pathnames: string[], lang?: string): string[];
};

export const localizePath = (): LocalizePathFn => {
  const { config } = getSpeakContext();
  const currentLang = getLang();

  const getRegEpx = (lang: string) => new RegExp(`(/${lang}/)|(/${lang}$)|(/(${lang})(?=\\?))`);

  const replace = (pathname: string, lang: string) => {
    const langParam = config.supportedLocales.find(locale => getRegEpx(locale.lang)?.test(pathname))?.lang;

    // Handle prefix
    if (langParam) {
      if (lang !== config.defaultLocale.lang) {
        pathname = pathname.replace(langParam, lang);
      } else {
        pathname = pathname.replace(getRegEpx(langParam), '/');
      }
    } else if (lang !== config.defaultLocale.lang) {
      pathname = `/${lang}${pathname}`;
    }

    // In prod, handle no prefix in domain-based routing
    if (!isDev) {
      if (config.domainBasedRouting?.prefix === 'as-needed' && isDefaultDomain(lang)) {
        pathname = pathname.replace(getRegEpx(lang), '/');
      }
    }

    return pathname;
  };

  const localize = (route: (string | URL) | string[], lang?: string) => {
    lang ??= currentLang;

    if (Array.isArray(route)) {
      return route.map(path => replace(path, lang!));
    }

    if (typeof route === 'string') {
      return replace(route, lang);
    }

    // Is URL
    if (config.domainBasedRouting) {
      route = localizeDomain(route, lang);
    }

    route.pathname = replace(route.pathname, lang);

    // Return URL
    return route.toString().replace(/\/\?/, '?');
  };

  return localize as LocalizePathFn;
};

export const translatePath = (): TranslatePathFn => {
  const { config } = getSpeakContext();
  const currentLang = getLang();

  const normalizePath = (pathname: string) => {
    const source = config.rewriteRoutes?.find(rewrite => (
      pathname === `/${rewrite.prefix}` ||
      pathname.startsWith(`/${rewrite.prefix}/`) ||
      pathname.startsWith(`${rewrite.prefix}/`)
    ));

    if (source) {
      pathname = pathname === `/${source.prefix}`
        ? '/'
        : pathname.startsWith('/')
          ? pathname.substring(`/${source.prefix}`.length)
          : pathname.substring(`${source.prefix}/`.length);

      const sourceEntries = Object.entries(source.paths).map(([from, to]) => [to, from]);
      const revertedPaths = Object.fromEntries(sourceEntries);

      const splitted = pathname.split('/');
      const translated = splitted.map(part => revertedPaths[part] ?? part);
      return translated.join('/');
    }

    return pathname;
  }

  const rewritePath = (pathname: string, prefix: string) => {
    let splitted = pathname.split('/');

    const destination = config.rewriteRoutes?.find(
      rewrite => (rewrite.prefix === prefix)
    );

    if (prefix && destination) { // the input prefix is present and not for the defaultLocale
      const keys = Object.keys(destination.paths);
      const translating = splitted.some(part => keys.includes(part));

      if ((pathname === '/') || translating) {
        pathname = pathname.startsWith('/')
          ? `/${prefix}` + pathname
          : `${prefix}/` + pathname;
      }
    }

    splitted = pathname.split('/');
    const translated = splitted.map(part => destination?.paths[part] ?? part);
    return translated.join('/')
  }

  const slashPath = (pathname: string, rewrote: string) => {
    if (pathname.endsWith('/') && !rewrote.endsWith('/')) {
      return rewrote + '/';
    } else if (!pathname.endsWith('/') && rewrote.endsWith('/') && (rewrote !== '/')) {
      return rewrote.substring(0, rewrote.length - 1);
    }

    return rewrote;
  }

  const translateOne = (pathname: string, lang: string) => {
    const normalized = normalizePath(pathname);
    const rewrote = rewritePath(normalized, lang);
    return slashPath(pathname, rewrote);
  };

  const translate = (route: (string | URL) | string[], lang?: string) => {
    lang ??= currentLang;

    if (!config.rewriteRoutes) {
      if (isDev) logWarn(`translatePath: rewriteRoutes not found`);
      return route;
    }

    if (Array.isArray(route)) {
      return route.map(path => translateOne(path, lang!));
    }

    if (typeof route === 'string') {
      return translateOne(route, lang);
    }

    route.pathname = translateOne(route.pathname, lang);

    return route.toString();
  };

  return translate as TranslatePathFn;
};

export const localizeDomain = (route: URL, lang: string): URL => {
  const { config } = getSpeakContext();

  let domain = config.supportedLocales.find(value => value.lang === lang)?.domain;
  if (!domain) {
    domain = config.supportedLocales.find(value => value.lang === lang)?.withDomain;
  }
  if (!domain) {
    if (isDev) logWarn(`localizeDomain: domain not found`);
  } else if (!isDev) {
    route.hostname = domain;
  }
  return route;
};

export const isDefaultDomain = (lang: string): boolean => {
  const { config } = getSpeakContext();
  return config.supportedLocales.find(value => value.lang === lang)?.domain !== undefined;
};

/**
 * Extract lang from domain
 */
export const extractFromDomain = (route: URL, supportedLocales: SpeakLocale[]): string | undefined => {
  const hostname = route.hostname;
  return supportedLocales.find(value => value.domain === hostname)?.lang;
};

/**
 * Extract lang from url
 */
export const extractFromUrl = (route: URL): string => {
  const parts = route.pathname.split('/');
  return route.pathname.startsWith('/') ? parts[1] : parts[0];
};

/**
 * Validate language[-script][-region]
 * - `language` ISO 639 two-letter or three-letter code
 * - `script` ISO 15924 four-letter script code
 * - `region` ISO 3166 two-letter, uppercase code
 */
export const validateLocale = (lang: string): boolean => {
  return /^([a-z]{2,3})(-[A-Z][a-z]{3})?(-[A-Z]{2})?$/.test(lang);
};
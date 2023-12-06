import { isDev } from '@builder.io/qwik/build';

import type { RewriteRouteOption, SpeakLocale } from './types';
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

interface InternalRewriteRouteOption extends RewriteRouteOption {
  /**
   * Set the language instead of the prefix
   */
  lang?: string;
}

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
    let url = new URL(route);
    if (config.domainBasedRouting) {
      url = localizeDomain(url, lang);
    }

    url.pathname = replace(url.pathname, lang);

    // Return URL
    return url.toString().replace(/\/\?/, '?');
  };

  return localize as LocalizePathFn;
};

export const translatePath = (): TranslatePathFn => {
  const { config } = getSpeakContext();
  const rewriteRoutes = config.rewriteRoutes as InternalRewriteRouteOption[];
  const currentLang = getLang();

  /**
   * To file-based routing
   */
  const normalizePath = (pathname: string) => {
    // Source by prefix
    let source = rewriteRoutes?.find(rewrite => (
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
    }

    // In prod, source by current lang in domain-based routing
    if (!isDev) {
      if (config.domainBasedRouting?.prefix === 'as-needed') {
        if (!source) {
          source = rewriteRoutes?.find(
            rewrite => rewrite.lang == currentLang
          );
        }
      }
    }

    if (source) {
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

    let destination = rewriteRoutes?.find(
      rewrite => rewrite.prefix === prefix
    );

    // Destination by prefix
    if (prefix && destination) {
      const keys = Object.keys(destination.paths);
      const translating = splitted.some(part => keys.includes(part));

      if ((pathname === '/') || translating) {
        pathname = pathname.startsWith('/')
          ? `/${prefix}` + pathname
          : `${prefix}/` + pathname;
      }
    }

    // In prod, destination by lang in domain-based routing
    if (!isDev) {
      if (config.domainBasedRouting?.prefix === 'as-needed') {
        if (prefix && !destination) {
          destination = rewriteRoutes?.find(
            rewrite => rewrite.lang === prefix
          );
        }
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

    if (!rewriteRoutes) {
      if (isDev) logWarn(`translatePath: rewriteRoutes not found`);
      return route;
    }

    if (Array.isArray(route)) {
      return route.map(path => translateOne(path, lang!));
    }

    if (typeof route === 'string') {
      return translateOne(route, lang);
    }

    // Is URL
    let url = new URL(route);
    if (config.domainBasedRouting) {
      url = translateDomain(url, lang);
    }

    url.pathname = translateOne(url.pathname, lang);

    return url.toString();
  };

  return translate as TranslatePathFn;
};

/**
 * Extract lang from domain
 */
export const extractFromDomain = (route: URL, domains: SpeakLocale[] | RewriteRouteOption[]): string | undefined => {
  const hostname = !route.hostname.startsWith('localhost') ? route.hostname : route.host; // with port
  const domain = domains.find(value => value.domain === hostname);
  return domain &&
    (('lang' in domain) ? domain.lang :
      ('prefix' in domain) ? domain.prefix :
        undefined)
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

/**
 * In prod, handle the needed prefixes in domain-based routing
 */
export function toPrefixAsNeeded(rewriteRoutes: RewriteRouteOption[]): RewriteRouteOption[] {
  if (isDev) return rewriteRoutes;

  const routes = rewriteRoutes.map(rewrite =>
  ({
    prefix: rewrite.domain ? undefined : rewrite.prefix, paths: rewrite.paths,
    lang: rewrite.prefix, domain: rewrite.domain, withDomain: rewrite.withDomain
  }));

  return routes;
}

const localizeDomain = (url: URL, lang: string): URL => {
  const { config } = getSpeakContext();

  const locale = config.supportedLocales.find(value => value.lang === lang);
  const domain = locale?.domain || locale?.withDomain;

  if (!domain) {
    if (isDev) logWarn(`localizeDomain: domain not found`);
  } else if (!isDev) {
    if (!domain.startsWith('localhost')) {
      url.hostname = domain;
    } else {
      url.host = domain; // with port
    }
  }
  return url;
};

const translateDomain = (url: URL, lang: string): URL => {
  const { config } = getSpeakContext();
  const rewriteRoutes = config.rewriteRoutes as InternalRewriteRouteOption[];

  const rewrite = rewriteRoutes?.find(value =>
    value.lang === lang ||
    value.prefix === lang);
  const domain = rewrite?.domain ||
    rewrite?.withDomain ||
    // Default locale
    rewriteRoutes.find(rewrite => rewrite.domain && Object.keys(rewrite.paths).length === 0)?.domain;

  if (!domain) {
    if (isDev) logWarn(`translateDomain: domain not found`);
  } else if (!isDev) {
    if (!domain.startsWith('localhost')) {
      url.hostname = domain;
    } else {
      url.host = domain; // with port
    }
  }
  return url;
};

const isDefaultDomain = (lang: string): boolean => {
  const { config } = getSpeakContext();
  return config.supportedLocales.find(value => value.lang === lang)?.domain !== undefined;
};

import { isDev } from '@builder.io/qwik/build';

import { type SpeakState } from './types';
import { _speakContext, getLang } from './context';
import { logWarn } from './log';

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

export const translatePath = (): TranslatePathFn => {
  const currentLang = getLang();

  const normalizePath = (pathname: string) => {
    const { config } = _speakContext as SpeakState;

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

  const rewritePath = (pathname: string, prefix?: string) => {
    const { config } = _speakContext as SpeakState;
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

  const translateOne = (pathname: string, lang?: string) => {
    lang ??= currentLang;

    const normalized = normalizePath(pathname);
    const rewrote = rewritePath(normalized, lang);
    return slashPath(pathname, rewrote);
  };

  const translate = (route: (string | URL) | string[], lang?: string) => {
    const { config } = _speakContext as SpeakState;

    if (!config.rewriteRoutes) {
      if (isDev) logWarn(`translatePath: rewriteRoutes not found`);
      return route;
    }

    if (Array.isArray(route)) {
      return route.map(path => translateOne(path, lang));
    }

    if (typeof route === 'string') {
      return translateOne(route, lang);
    }

    route.pathname = translateOne(route.pathname, lang);

    return route.toString();
  };

  return translate as TranslatePathFn;
};

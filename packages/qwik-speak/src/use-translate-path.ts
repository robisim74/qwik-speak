import { noSerialize } from '@builder.io/qwik';
import { useSpeakContext } from './use-speak';

export type TranslatePathFn = {
  /**
   * Translate a path.
   * @param pathname The path to translate
   * @param lang Optional language if different from the default one
   * @returns The translation or the path if not found
   */
  (pathname: string, lang?: string): string;
  /**
   * Translate an array of paths.
   * @param pathname The array of paths to translate
   * @param lang Optional language if different from the default one
   * @returns The translations or the paths if not found
   */
  (pathname: string[], lang?: string): string[];
};

export const useTranslatePath = (): TranslatePathFn => {
  const ctx = useSpeakContext();

  const normalizePath = (pathname: string) => {
    const { config } = ctx;

    const source = config.rewriteRoutes?.find(rewrite => (
      pathname.startsWith(`/${rewrite.prefix}/`) ||
      pathname.startsWith(`${rewrite.prefix}/`)
    ))

    if (source) {
      pathname = pathname.startsWith('/')
        ? pathname.substring(`/${source.prefix}`.length)
        : pathname.substring(`${source.prefix}/`.length)

      const sourceEntries = Object.entries(source.paths).map(([from, to]) => [to, from])
      const revertedPaths = Object.fromEntries(sourceEntries)

      const splitted = pathname.split('/')
      const translated = splitted.map(part => revertedPaths[part] ?? part)
      return translated.join('/')
    }

    return pathname
  }

  const rewritePath = (pathname: string, prefix?: string) => {
    const { config } = ctx;
    let splitted = pathname.split('/')

    const destination = config.rewriteRoutes?.find(
        rewrite => (rewrite.prefix === prefix)
    )

    if (prefix && destination) { // the input prefix is present and not for the defaultLocale
      const keys = Object.keys(destination.paths)
      const translating = splitted.some(part => keys.includes(part))

      if((pathname === '/') || translating) {
        pathname = pathname.startsWith('/')
            ? `/${prefix}` + pathname
            : `${prefix}/` + pathname
      }
    }

    splitted = pathname.split('/')
    const translated = splitted.map(part => destination?.paths[part] ?? part)
    return translated.join('/')
  }

  const translate = (pathname: string | string[], lang?: string) => {
    const { locale } = ctx;

    lang ??= locale.lang;

    if (Array.isArray(pathname)) {
      return pathname.map(path => {
        const normalized = normalizePath(path)
        return rewritePath(normalized, lang)
      })
    }

    const normalized = normalizePath(pathname)
    return rewritePath(normalized, lang)
  };

  return noSerialize(translate) as TranslatePathFn;
};
import type { RewriteRouteOption } from 'qwik-speak';

/**
 * Translation paths
 */
export const rewriteRoutes: RewriteRouteOption[] = [
  // No prefix/paths for default locale
  {
    prefix: 'it-IT',
    paths: {
      'page': 'pagina'
    }
  }, {
    prefix: 'de-DE',
    paths: {
      'page': 'seite'
    }
  }
];

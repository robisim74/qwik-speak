import type { RewriteRouteOption } from 'qwik-speak';

/**
 * Translation paths
 */
export const rewriteRoutes: RewriteRouteOption[] = [
  // No prefix for default locale
  // {
  //   paths: {
  //     'page': 'page'
  //   }
  // },
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
]

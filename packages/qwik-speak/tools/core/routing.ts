import type { RewriteRouteOption } from './types';

/**
 * In prod, handle the needed prefixes in domain-based routing
 */
export function toPrefixAsNeeded(rewriteRoutes: RewriteRouteOption[], mode: string): RewriteRouteOption[] {
  if (mode !== 'production') return rewriteRoutes;

  const routes = rewriteRoutes.map(rewrite =>
  ({
    prefix: rewrite.domain ? undefined : rewrite.prefix, paths: rewrite.paths,
    lang: rewrite.prefix, domain: rewrite.domain, withDomain: rewrite.withDomain
  }));

  return routes;
}

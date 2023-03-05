import type { Translation } from './types';

export function toJsonString(target: Translation): string {
  return JSON.stringify(target, replacer, 2);
}

export function minDepth(target: Translation): number {
  return typeof target === 'object' && Object.keys(target).length > 0 ?
    1 + Math.min(1, ...Object.values(target).map(o => minDepth(o)))
    : 0
}

export function sortTarget(target: Translation) {
  return Object.keys(target).sort().reduce(
    (out: any, key: string) => {
      if (typeof target[key] === 'object' && !Array.isArray(target[key]))
        out[key] = sortTarget(target[key]);
      else
        out[key] = target[key];
      return out;
    }, {}
  );
}

/**
 * Remove escaped sequences
 */
function replacer(key: string, value: string | Translation) {
  return typeof value === 'string' ? value.replace(/\\/g, '') : value;
}

export function toJsonString(target: { [key: string]: any }): string {
  return JSON.stringify(target, replacer, 2);
}

export function minDepth(target: { [key: string]: any }): number {
  return typeof target === 'object' && Object.keys(target).length > 0 ?
    1 + Math.min(1, ...Object.values(target).map(o => minDepth(o)))
    : 0
}

export function sortTarget(target: { [key: string]: any }) {
  return Object.keys(target).sort().reduce(
    (out: any, key: string) => {
      if (typeof target[key] === 'object')
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
function replacer(key: string, value: any) {
  return typeof value === 'string' ? value.replace(/\\/g, '') : value;
};

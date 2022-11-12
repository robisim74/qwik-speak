/**
 * https://github.com/lukeed/dset
 */
export function deepSet(target: { [key: string]: any }, keys: string[], val: string) {
  let i = 0;
  const len = keys.length;
  while (i < len) {
    const key = keys[i++];
    target[key] = (i === len) ? val : typeof target[key] === 'object' ? target[key] : {};
    target = target[key];
  }
}

export function deepMerge(target: { [key: string]: any }, source: { [key: string]: any }) {
  if (typeof target === 'object' && typeof source === 'object') {
    for (const key of Object.keys(source)) {
      if (!target[key] || typeof source[key] !== 'object')
        target[key] = source[key];
      else
        deepMerge(target[key], source[key]);
    }
  }
  return target;
}

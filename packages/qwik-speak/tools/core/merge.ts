import type { Translation } from './types';

export function deepSet(target: Translation, keys: string[], val: string | Translation) {
  let i = 0;
  const len = keys.length;
  while (i < len) {
    const key = keys[i++];
    target[key] = (i === len) ? val : typeof target[key] === 'object' ? target[key] : {};
    target = target[key];
  }
}

export function deepMerge(target: Translation, source: Translation) {
  if (typeof target === 'object' && typeof source === 'object') {
    Object.keys(source).map(k => {
      target[k] = deepMerge(target[k], source[k]);
    });
    return target;
  }
  return source;
}

export function deepClone(value: string | Translation) {
  if (typeof value === 'object') return JSON.parse(JSON.stringify(value));
  return value;
}

export function merge(target: Translation, source: Translation) {
  target = { ...target, ...source };
  return target;
}

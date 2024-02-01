import type { Translation } from './types';

export function toJsonString(target: Translation): string {
  return JSON.stringify(target, replacer, 2);
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

export const getJsonPaths = (
  obj: Translation,
  keySeparator: string,
  parentKey = '',
  result = new Map<string, string>()
): Map<string, string> => {
  for (const key in obj) {
    const path = parentKey ? `${parentKey}${keySeparator}${key}` : key;
    const value = obj[key];

    if (Array.isArray(value)) {
      value.forEach((item: any, index: number) => {
        const itemPath = `${path}${keySeparator}${index}`;
        if (typeof item === 'object' && item !== null) {
          getJsonPaths(item, keySeparator, itemPath, result);
        } else {
          result.set(itemPath, item);
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      getJsonPaths(value, keySeparator, path, result);
    } else {
      result.set(path, value);
    }
  }

  return result;
};

/**
 * Remove escaped sequences
 */
function replacer(key: string, value: string | Translation) {
  return typeof value === 'string' ? value.replace(/\\/g, '') : value;
}

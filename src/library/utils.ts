export const isObject = <T>(item: T): boolean =>
  typeof item === 'object' && !Array.isArray(item);

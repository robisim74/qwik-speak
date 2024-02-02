import crypto from 'crypto';

import type { Translation } from './types';

function sortObject(obj: Record<string, any>) {
  return Object.keys(obj).sort().reduce((result: Record<string, any>, key: string) => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
      result[key] = sortObject(obj[key]);
    } else {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

/**
 * Generate a unique key for a given input
 */
export function generateAutoKey(input: string | number | Record<string, any>) {
  let key = '';
  switch (typeof input) {
    case 'string':
      key = input;
      break;
    case 'object':
      // Sort the object to get a consistent key: The order of the keys in an object is not guaranteed
      key = JSON.stringify(sortObject(input));
      break;
    case 'number':
      key = input.toString();
      break;
  }
  return `autoKey_${generateUUID(key)}`;
}

/**
 * Evaluate if the key could be an existing object path
 */
export function isObjectPath(key: string, separator: string): boolean {
  const regex = new RegExp(`^(?!\\${separator})(?!.*\\${separator}\\s)(?!.*\\s\\${separator})(?!.*\\${separator}$)(?=.*\\${separator}.*[^\\s]+)$`);
  if (!regex.test(key)) {
    return false;
  }

  const segments = key.split(separator);
  const variableNameRegex = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
  for (const segment of segments) {
    if (!variableNameRegex.test(segment)) {
      return false;
    }
  }

  return true;
}

/**
 * Evaluate if the key could be an existing object path. If the path does not exist in an asset, it will return false.
 * It will return true if the path exists in all assets
 */
export function isExistingKey(data: Map<string, Translation> | Translation, path: string, keySeparator: string) {
  const keys = path.split(keySeparator);
  let keyFound = false;

  // Iterate if data is a Map
  if (data instanceof Map) {
    for (const translation of data.values()) {
      let value = translation;
      for (const key of keys) {
        if (value[key] !== undefined) {
          keyFound = true;
        } else {
          keyFound = false;
          break;
        }
        value = value[key];
      }
      if (!keyFound) {
        break;
      }
    }
  } else if (typeof data === 'object') {
    let value = data;
    for (const key of keys) {
      if (value[key] !== undefined) {
        keyFound = true;
      } else {
        keyFound = false;
        break;
      }
      value = value[key];
    }
  }

  return keyFound;
}

/**
 * Generate a consistent UUID (Universally Unique Identifier) from a given string using a hash function
 */
export function generateUUID(data: string) {
  return crypto.createHash('md5').update(data).digest('hex');
}

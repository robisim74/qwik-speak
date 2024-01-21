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
 * Generate a unique key for a given input.
 * @param input
 */
export function generateAutoKey(input: string | number | Record<string, any>) {
  let key = '';
  switch (typeof input) {
    case 'string':
      key = input;
      break;
    case 'object':
      // Sort the object to get a consistent key: The order of the keys in an object is not guaranteed.
      key = JSON.stringify(sortObject(input));
      break;
    case 'number':
      key = input.toString();
      break;
  }
  return `autoKey_${sha1(key)}`;
}

/**
 * Evaluate if the key could be an existing object path.
 * @param key
 */
export function isObjectPath(key: string): boolean {
  const regex = /^(?!\.)(?!.*\.\s)(?!.*\s\.)(?!.*\.$)(?=.*\..*)[^\s]+$/;
  return regex.test(key);
}

/**
 * Evaluate if the key could be an existing object path. If the path does no exist in an asset, it will return false.
 * It will return true if the path exists in all assets.
 * @param data
 * @param path
 */
export function isExistingKey(data: Map<string, Translation> | Translation, path: string) {
  const keys = path.split('.');

  if (!data) {
    throw new Error(`Data is undefined`);
  }
  if (!path) {
    throw new Error(`Path is undefined`);
  }

  // iterate if data is a Map
  if (data instanceof Map) {
    for (const translation of data.values()) {
      let value = translation;
      for (const key of keys) {
        if (value[key] === undefined) {
          return false;
        }
        value = value[key];
      }
    }
    return true;
  }

  // iterate if data is an object
  if (typeof data === 'object') {
    let value = data;
    for (const key of keys) {
      if (value[key] === undefined) {
        return false;
      }
      value = value[key];
    }
    return true;
  }

  return true;
}

/**
 * Generates a SHA1 hash from a string. This could be improved with an isomorphic md5 hash but existing libraries
 * all use promises which makes things a lot more complicated. SHA1 is not secure but it is fast and good enough.
 * @param msg A string to hash
 */
export function sha1(msg: string) {
  if (msg === undefined) {
    throw new Error('sha1(): Illegal undefined msg');
  }

  function rotate_left(n: number, s: number) {
    return (n << s) | (n >>> (32 - s));
  }

  function cvt_hex(val: number) {
    let str = '';
    let i;
    let v;
    for (i = 7; i >= 0; i--) {
      v = (val >>> (i * 4)) & 0x0f;
      str += v.toString(16);
    }
    return str;
  }

  function Utf8Encode(string: string) {
    string = string.replace(/\r\n/g, '\n');
    let utftext = '';
    for (let n = 0; n < string.length; n++) {
      const c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }

  let blockstart;
  let i, j;
  const W = new Array(80);
  let H0 = 0x67452301;
  let H1 = 0xEFCDAB89;
  let H2 = 0x98BADCFE;
  let H3 = 0x10325476;
  let H4 = 0xC3D2E1F0;
  let A, B, C, D, E;
  let temp;
  msg = Utf8Encode(msg);
  const msg_len = msg.length;
  const word_array = [];
  for (i = 0; i < msg_len - 3; i += 4) {
    j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
      msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
    word_array.push(j);
  }
  switch (msg_len % 4) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
      break;
    case 2:
      i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
      break;
    case 3:
      i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 |
        msg.charCodeAt(msg_len - 1) << 8 | 0x80;
      break;
  }
  word_array.push(i);
  while ((word_array.length % 16) != 14) word_array.push(0);
  word_array.push(msg_len >>> 29);
  word_array.push((msg_len << 3) & 0x0ffffffff);
  for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
    for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
    for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;
    for (i = 0; i <= 19; i++) {
      temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    for (i = 20; i <= 39; i++) {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    for (i = 40; i <= 59; i++) {
      temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    for (i = 60; i <= 79; i++) {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }
  temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
  return temp.toLowerCase();
}

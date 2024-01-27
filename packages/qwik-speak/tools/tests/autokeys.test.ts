import { test, describe, expect } from 'vitest';

import { generateAutoKey } from '../core/autokeys';

describe('autokeys', () => {
  test('generateAutoKey', () => {
    let input = 'This a simple text';
    let key = generateAutoKey(input);
    expect(key).toBe('autoKey_a90b00418cdca1213941694591a292bb');
    input = 'これは簡単なテキストです';
    key = generateAutoKey(input);
    expect(key).toBe('autoKey_509bb80809adf5525fb163eb18e546e1');
    const defaultValues = {
      'one': '{{ value }} {{ color }} zebra',
      'other': '{{ value }} {{ color }} zebras'
    };
    key = generateAutoKey(defaultValues);
    expect(key).toBe('autoKey_3c909eb27a10640be9495cff142f601c');
  });
});

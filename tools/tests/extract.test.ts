import { test, describe, expect, vi } from 'vitest';

import { readdir, readFile, writeFile } from 'fs/promises';
import { normalize } from 'path';

import { qwikSpeakExtract } from '../extract/index';
import { mockAsset, mockSource } from './mock';

// Mock part of 'fs/promises' module
vi.mock('fs/promises', async () => {
  /* eslint-disable-next-line */
  const mod = await vi.importActual<typeof import('fs/promises')>('fs/promises');
  return {
    ...mod,
    readdir: vi.fn()
      .mockImplementationOnce(() => [{ name: 'home.tsx', isDirectory: () => false }])
      .mockImplementationOnce(() => ['home.json']),
    readFile: vi.fn()
      .mockImplementationOnce(() => mockSource)
      .mockImplementationOnce(() => mockAsset),
    writeFile: vi.fn()
  };
});

describe('extract', () => {
  test('extract json', async () => {
    await qwikSpeakExtract({
      supportedLangs: ['en-US']
    });

    expect(readdir).toHaveBeenCalledTimes(2);
    expect(readFile).toHaveBeenCalledTimes(2);

    expect(writeFile).toHaveBeenCalledTimes(2);
    expect(writeFile).toHaveBeenNthCalledWith(1, normalize('public/i18n/en-US/app.json'), `{
  "app": {
    "subtitle": "Translate your Qwik apps into any language",
    "title": "Qwik Speak"
  }
}`);
    expect(writeFile).toHaveBeenNthCalledWith(2, normalize('public/i18n/en-US/home.json'), `{
  "home": {
    "array": [
      "one",
      "two",
      "three"
    ],
    "arrayObjects": [
      {
        "one": "1",
        "two": "2"
      }
    ],
    "dates": "Dates & relative time",
    "devs": {
      "one": "",
      "other": ""
    },
    "greeting": "Hi! I am {{name}}",
    "increment": "Increment",
    "numbers": "Numbers & currencies",
    "obj": {
      "one": "1",
      "two": "2"
    },
    "params": "",
    "plural": "Plural",
    "tags": "Html tags",
    "text": "<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>"
  }
}`);
  });
});

import { test, describe, expect, vi } from 'vitest';

import { readdir, readFile, writeFile } from 'fs/promises';
import { normalize } from 'path';

import { qwikSpeakExtract } from '../extract/index';
import { mockAsset, mockExtractedAsset, mockSource } from './mock';

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
      supportedLangs: ['en-US'],
      basePath: '../../'
    });

    expect(readdir).toHaveBeenCalledTimes(2);
    expect(readFile).toHaveBeenCalledTimes(2);

    expect(writeFile).toHaveBeenCalledTimes(3);
    expect(writeFile).toHaveBeenNthCalledWith(1, normalize('../../i18n/en-US/app.json'), `{
  "app": {
    "subtitle": "",
    "title": ""
  }
}`);
    expect(writeFile).toHaveBeenNthCalledWith(2, normalize('../../i18n/en-US/home.json'), mockExtractedAsset);
    expect(writeFile).toHaveBeenNthCalledWith(3, normalize('../../i18n/en-US/runtime.json'), `{
  "runtime": {
    "test": ""
  }
}`);
  });
});

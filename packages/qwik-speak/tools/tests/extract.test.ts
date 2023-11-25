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
      .mockImplementationOnce(() => ['app.json']),
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

    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenNthCalledWith(1, normalize('../../i18n/en-US/app.json'), mockExtractedAsset);
  });
});

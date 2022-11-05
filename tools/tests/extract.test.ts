import fs from 'fs/promises';
import { normalize } from 'path';

import { extract } from '../extract/index';
import { mockAsset, mockSource } from './mock';

jest.mock('fs/promises');

describe('extract', () => {
  beforeEach(() => {
    // Reset mocks
    jest.resetAllMocks();
  });

  test('extract json', async () => {
    fs.readdir = jest.fn()
      .mockImplementationOnce(() => [{ name: 'home.tsx', isDirectory: () => false }])
      .mockImplementationOnce(() => ['home.json']);
    fs.readFile = jest.fn()
      .mockImplementationOnce(() => mockSource)
      .mockImplementationOnce(() => mockAsset);
    fs.writeFile = jest.fn();

    await extract({
      supportedLangs: ['en-US']
    });

    expect(fs.writeFile).toHaveBeenCalledTimes(2);
    expect(fs.writeFile).toHaveBeenNthCalledWith(1, normalize('public/i18n/en-US/app.json'), `{
  "app": {
    "subtitle": "Translate your Qwik apps into any language",
    "title": "Qwik Speak"
  }
}`);
    expect(fs.writeFile).toHaveBeenNthCalledWith(2, normalize('public/i18n/en-US/home.json'), `{
  "home": {
    "dates": "Dates & relative time",
    "greeting": "Hi! I am {{name}}",
    "increment": "Increment",
    "numbers": "Numbers & currencies",
    "params": "",
    "plural": "Plural",
    "tags": "Html tags",
    "text": "<em>Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps</em>"
  }
}`);
  });
});

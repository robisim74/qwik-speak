import type { QwikSpeakExtractOptions } from '../core/types';
import { parseArgument } from '../core/cli-parser';
import { qwikSpeakExtract } from './index';

const assertType = (value: any, type: string): boolean => {
  if (type === value) return true;
  if (type === 'array' && Array.isArray(value)) return true;
  if (type === 'string' && typeof (value) === 'string') return true;
  return false;
};

const wrongOption = (key: string, value: any): string => `- option "${key}": wrong value ${JSON.stringify(value)}`;
const missingOption = (name: string): string => `- missing option: "${name}"`;

const args = process.argv.slice(2);

const options: Partial<QwikSpeakExtractOptions> = {};

const errors: string[] = [];

// Parse arguments
for (const arg of args) {
  const { key, value } = parseArgument(arg);
  switch (key) {
    case 'basePath':
      if (assertType(value, 'string')) options.basePath = value;
      else errors.push(wrongOption(key, value));
      break;
    case 'sourceFilesPath':
      if (assertType(value, 'string')) options.sourceFilesPath = value;
      else errors.push(wrongOption(key, value));
      break;
    case 'excludedPaths':
      if (assertType(value, 'array')) options.excludedPaths = value;
      else if (assertType(value, 'string')) options.excludedPaths = [value];
      else errors.push(wrongOption(key, value));
      break;
    case 'assetsPath':
      if (assertType(value, 'string')) options.assetsPath = value;
      else errors.push(wrongOption(key, value));
      break;
    case 'format':
      if (assertType(value, 'json')) options.format = value;
      else errors.push(wrongOption(key, value));
      break;
    case 'supportedLangs':
      if (assertType(value, 'array')) options.supportedLangs = value;
      else if (assertType(value, 'string')) options.supportedLangs = [value];
      else errors.push(wrongOption(key, value));
      break;
    case 'keySeparator':
      if (assertType(value, 'string')) options.keySeparator = value;
      else errors.push(wrongOption(key, value));
      break;
    case 'keyValueSeparator':
      if (assertType(value, 'string')) options.keyValueSeparator = value;
      else errors.push(wrongOption(key, value));
      break;
    case 'error':
      errors.push(value);
      break;
    default:
      errors.push(`- unknown option: "${key}"`);
  }
}

// Required options
if (!options.supportedLangs) errors.push(missingOption('supportedLangs'));

// Log errors
if (errors.length > 0) {
  console.log('\x1b[36m%s\x1b[0m', 'Qwik Speak Extract options errors:');
  for (const error of errors) {
    console.log('\x1b[33m%s\x1b[0m', error);
  }

  process.exitCode = 1; // Exit process
}

// Process
console.log('\x1b[36m%s\x1b[0m', 'Qwik Speak Extract');
console.log('\x1b[32m%s\x1b[0m', 'extracting translation...');

qwikSpeakExtract(options as QwikSpeakExtractOptions);

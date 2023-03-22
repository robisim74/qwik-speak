import { test, describe, expect } from 'vitest';

import { $translate as t } from '../translate';
import { ctx } from './config';

describe('translate function', () => {
  test('translate', () => {
    const value = t('test', {}, ctx);
    expect(value).toBe('Test');
  });
  test('translate with default value', () => {
    const value = t('test@@Default', {}, ctx);
    expect(value).toBe('Test');
  });
  test('translate with params', () => {
    const value = t('testParams', { param: 'params' }, ctx);
    expect(value).toBe('Test params');
  });
  test('translate with array of keys', () => {
    const value = t(['test', 'testParams'], { param: 'params' }, ctx);
    expect(value).toEqual(['Test', 'Test params']);
  });
  test('missing value', () => {
    const value = t('test1', {}, ctx);
    expect(value).toBe('test1');
  });
  test('key separator', () => {
    const value = t('nested.test', {}, ctx);
    expect(value).toBe('Test');
  });
  test('key-value separator', () => {
    const value = t('test1@@Test 1', {}, ctx);
    expect(value).toBe('Test 1');
  });
  test('key-value separator with params', () => {
    const value = t('test1@@Test {{param}}', { param: 'params' }, ctx);
    expect(value).toBe('Test params');
  });
  test('array', () => {
    const value = t('nested.array', {}, ctx);
    expect(value).toEqual(['Test1', 'Test2']);
  });
  test('array with dot notation', () => {
    const value = t('nested.array.1', {}, ctx);
    expect(value).toBe('Test2');
  });
  test('object', () => {
    const value = t('nested', {}, ctx);
    expect(value).toEqual({ test: 'Test', array: ['Test1', 'Test2'] });
  });
  test('array of objects', () => {
    const value = t('arrayObjects', {}, ctx);
    expect(value).toEqual([
      { one: '1' },
      { two: '3' }
    ]);
  });
});

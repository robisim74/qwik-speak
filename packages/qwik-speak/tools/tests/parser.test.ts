import { test, describe, expect } from 'vitest';

import { getTranslateAlias, parse, parseSequenceExpressions, tokenize } from '../core/parser';

describe('parser: tokenize', () => {
  test('tokenize', () => {
    const code = "t('app.title')";
    const tokens = tokenize(code);
    expect(tokens).toEqual(
      [
        { type: 'Identifier', value: 't', position: { start: 0, end: 0 } },
        { type: 'Punctuator', value: '(', position: { start: 1, end: 1 } },
        {
          type: 'Literal',
          value: "'app.title'",
          position: { start: 2, end: 12 }
        },
        { type: 'Punctuator', value: ')', position: { start: 13, end: 13 } }
      ]
    );
  });
  test('tokenize with escaped quotes', () => {
    const code = String.raw`t('page.text@@I\'m a default value')`; // String.raw maintains escaped
    const tokens = tokenize(code);
    expect(tokens).toEqual(
      [
        { type: 'Identifier', value: 't', position: { start: 0, end: 0 } },
        { type: 'Punctuator', value: '(', position: { start: 1, end: 1 } },
        {
          type: 'Literal',
          value: "'page.text@@I\\'m a default value'",
          position: { start: 2, end: 34 }
        },
        { type: 'Punctuator', value: ')', position: { start: 35, end: 35 } }
      ]
    );
  });
  test('tokenize with nested quotes', () => {
    const code = `t("page.text@@I'm a default value")`;
    const tokens = tokenize(code);
    expect(tokens).toEqual(
      [
        { type: 'Identifier', value: 't', position: { start: 0, end: 0 } },
        { type: 'Punctuator', value: '(', position: { start: 1, end: 1 } },
        {
          type: 'Literal',
          value: `"page.text@@I'm a default value"`,
          position: { start: 2, end: 33 }
        },
        { type: 'Punctuator', value: ')', position: { start: 34, end: 34 } }
      ]
    );
  });
  test('tokenize with nested parenthesis', () => {
    const code = "t('head.home.description@@Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps')";
    const tokens = tokenize(code);
    expect(tokens).toEqual(
      [
        { type: 'Identifier', value: 't', position: { start: 0, end: 0 } },
        { type: 'Punctuator', value: '(', position: { start: 1, end: 1 } },
        {
          type: 'Literal',
          value: "'head.home.description@@Internationalization (i18n) library to translate texts, dates and numbers in Qwik apps'",
          position: { start: 2, end: 112 }
        },
        {
          type: 'Punctuator',
          value: ')',
          position: { start: 113, end: 113 }
        }
      ]
    );
  });
  test('tokenize with params', () => {
    const code = `t('home.greeting', {
      name: 'Qwik Speak'
  })`;
    const tokens = tokenize(code);
    expect(tokens).toEqual(
      [
        { type: 'Identifier', value: 't', position: { start: 0, end: 0 } },
        { type: 'Punctuator', value: '(', position: { start: 1, end: 1 } },
        {
          type: 'Literal',
          value: "'home.greeting'",
          position: { start: 2, end: 16 }
        },
        { type: 'Punctuator', value: ',', position: { start: 17, end: 17 } },
        { type: 'Punctuator', value: '{', position: { start: 19, end: 19 } },
        {
          type: 'Identifier',
          value: 'name',
          position: { start: 27, end: 30 }
        },
        { type: 'Punctuator', value: ':', position: { start: 31, end: 31 } },
        {
          type: 'Literal',
          value: "'Qwik Speak'",
          position: { start: 33, end: 44 }
        },
        { type: 'Punctuator', value: '}', position: { start: 48, end: 48 } },
        { type: 'Punctuator', value: ')', position: { start: 49, end: 49 } }
      ]
    );
  });
  test('tokenize with dynamic params', () => {
    const code = `t('home.greeting', {
      name: name
  })`;
    const tokens = tokenize(code);
    expect(tokens).toEqual(
      [
        { type: 'Identifier', value: 't', position: { start: 0, end: 0 } },
        { type: 'Punctuator', value: '(', position: { start: 1, end: 1 } },
        {
          type: 'Literal',
          value: "'home.greeting'",
          position: { start: 2, end: 16 }
        },
        { type: 'Punctuator', value: ',', position: { start: 17, end: 17 } },
        { type: 'Punctuator', value: '{', position: { start: 19, end: 19 } },
        {
          type: 'Identifier',
          value: 'name',
          position: { start: 27, end: 30 }
        },
        { type: 'Punctuator', value: ':', position: { start: 31, end: 31 } },
        {
          type: 'Identifier',
          value: 'name',
          position: { start: 33, end: 36 }
        },
        { type: 'Punctuator', value: '}', position: { start: 40, end: 40 } },
        { type: 'Punctuator', value: ')', position: { start: 41, end: 41 } }
      ]
    );
  });
  test('tokenize with arguments', () => {
    const code = `t('home.greeting', {
      name: name
  }, ctx, 'en-US')`;
    const tokens = tokenize(code);
    expect(tokens).toEqual(
      [
        { type: 'Identifier', value: 't', position: { start: 0, end: 0 } },
        { type: 'Punctuator', value: '(', position: { start: 1, end: 1 } },
        {
          type: 'Literal',
          value: "'home.greeting'",
          position: { start: 2, end: 16 }
        },
        { type: 'Punctuator', value: ',', position: { start: 17, end: 17 } },
        { type: 'Punctuator', value: '{', position: { start: 19, end: 19 } },
        {
          type: 'Identifier',
          value: 'name',
          position: { start: 27, end: 30 }
        },
        { type: 'Punctuator', value: ':', position: { start: 31, end: 31 } },
        {
          type: 'Identifier',
          value: 'name',
          position: { start: 33, end: 36 }
        },
        { type: 'Punctuator', value: '}', position: { start: 40, end: 40 } },
        { type: 'Punctuator', value: ',', position: { start: 41, end: 41 } },
        {
          type: 'Identifier',
          value: 'ctx',
          position: { start: 43, end: 45 }
        },
        { type: 'Punctuator', value: ',', position: { start: 46, end: 46 } },
        {
          type: 'Literal',
          value: "'en-US'",
          position: { start: 48, end: 54 }
        },
        { type: 'Punctuator', value: ')', position: { start: 55, end: 55 } }
      ]
    );
  });
  test('tokenize with undefined arguments', () => {
    const code = "t('home.greeting', undefined, undefined, 'en-US')";
    const tokens = tokenize(code);
    expect(tokens).toEqual(
      [
        { type: 'Identifier', value: 't', position: { start: 0, end: 0 } },
        { type: 'Punctuator', value: '(', position: { start: 1, end: 1 } },
        {
          type: 'Literal',
          value: "'home.greeting'",
          position: { start: 2, end: 16 }
        },
        { type: 'Punctuator', value: ',', position: { start: 17, end: 17 } },
        {
          type: 'Literal',
          value: 'undefined',
          position: { start: 19, end: 27 }
        },
        { type: 'Punctuator', value: ',', position: { start: 28, end: 28 } },
        {
          type: 'Literal',
          value: 'undefined',
          position: { start: 30, end: 38 }
        },
        { type: 'Punctuator', value: ',', position: { start: 39, end: 39 } },
        {
          type: 'Literal',
          value: "'en-US'",
          position: { start: 41, end: 47 }
        },
        { type: 'Punctuator', value: ')', position: { start: 48, end: 48 } }
      ]
    );
  });
  test('tokenize with numbers', () => {
    const code = "t('count', { value: +1.2 })";
    const tokens = tokenize(code);
    expect(tokens).toEqual(
      [
        { type: 'Identifier', value: 't', position: { start: 0, end: 0 } },
        { type: 'Punctuator', value: '(', position: { start: 1, end: 1 } },
        { type: 'Literal', value: "'count'", position: { start: 2, end: 8 } },
        { type: 'Punctuator', value: ',', position: { start: 9, end: 9 } },
        { type: 'Punctuator', value: '{', position: { start: 11, end: 11 } },
        {
          type: 'Identifier',
          value: 'value',
          position: { start: 13, end: 17 }
        },
        { type: 'Punctuator', value: ':', position: { start: 18, end: 18 } },
        { type: 'Literal', value: '+1.2', position: { start: 20, end: 23 } },
        { type: 'Punctuator', value: '}', position: { start: 25, end: 25 } },
        { type: 'Punctuator', value: ')', position: { start: 26, end: 26 } }
      ]
    );
  });
  test('tokenize with array of keys', () => {
    const code = "t(['key1', 'key2'])";
    const tokens = tokenize(code);
    expect(tokens).toEqual(
      [
        { type: 'Identifier', value: 't', position: { start: 0, end: 0 } },
        { type: 'Punctuator', value: '(', position: { start: 1, end: 1 } },
        { type: 'Punctuator', value: '[', position: { start: 2, end: 2 } },
        { type: 'Literal', value: "'key1'", position: { start: 3, end: 8 } },
        { type: 'Punctuator', value: ',', position: { start: 9, end: 9 } },
        {
          type: 'Literal',
          value: "'key2'",
          position: { start: 11, end: 16 }
        },
        { type: 'Punctuator', value: ']', position: { start: 17, end: 17 } },
        { type: 'Punctuator', value: ')', position: { start: 18, end: 18 } }
      ]
    );
  });
});

describe('parser: parse', () => {
  test('parse', () => {
    const code = "t('app.title')";
    const tokens = tokenize(code);
    const callExpression = parse(tokens, code, '\\bt');
    expect(callExpression).toEqual(
      {
        type: 'CallExpression',
        value: "t('app.title')",
        arguments: [{ type: 'Literal', value: 'app.title' }]
      }
    );
  });
  test('parse with params', () => {
    const code = `t('home.greeting', {
      name: 'Qwik Speak'
  })`;
    const tokens = tokenize(code);
    const callExpression = parse(tokens, code, '\\bt');
    expect(callExpression).toEqual(
      {
        type: 'CallExpression',
        value: "t('home.greeting', {\n      name: 'Qwik Speak'\n  })",
        arguments: [
          { type: 'Literal', value: 'home.greeting' },
          {
            type: 'ObjectExpression', properties: [
              {
                type: 'Property',
                key: { type: 'Identifier', value: 'name' },
                value: { type: 'Literal', value: 'Qwik Speak' }
              }
            ]
          }
        ]
      }
    );
  });
  test('parse with dynamic params', () => {
    const code = `t('home.greeting', {
      name: obj.name, greeting: getGreeting()
  }, ctx, 'en-US')`;
    const tokens = tokenize(code);
    const callExpression = parse(tokens, code, '\\bt');
    expect(callExpression).toEqual(
      {
        type: 'CallExpression',
        value: "t('home.greeting', {\n" +
          '      name: obj.name, greeting: getGreeting()\n' +
          "  }, ctx, 'en-US')",
        arguments: [
          { type: 'Literal', value: 'home.greeting' },
          {
            type: 'ObjectExpression', properties: [
              {
                type: 'Property',
                key: { type: 'Identifier', value: 'name' },
                value: { type: 'Identifier', value: 'obj.name' }
              },
              {
                type: 'Property',
                key: { type: 'Identifier', value: 'greeting' },
                value: { type: 'CallExpression', value: 'getGreeting()' }
              }
            ]
          },
          { type: 'Identifier', value: 'ctx' },
          { type: 'Literal', value: 'en-US' }
        ]
      }
    );
  });
  test('parse with function call params', () => {
    const code = `t('home.greeting', getGreeting())`;
    const tokens = tokenize(code);
    const callExpression = parse(tokens, code, '\\bt');
    expect(callExpression).toEqual(
      {
        type: 'CallExpression',
        value: "t('home.greeting', getGreeting())",
        arguments: [
          { type: 'Literal', value: 'home.greeting' },
          { type: 'CallExpression', value: 'getGreeting' }
        ]
      }
    );
  });
  test('parse with nested properties params', () => {
    const code = `t('home.greeting', state.greeting)`;
    const tokens = tokenize(code);
    const callExpression = parse(tokens, code, '\\bt');
    expect(callExpression).toEqual(
      {
        type: 'CallExpression',
        value: "t('home.greeting', state.greeting)",
        arguments: [
          { type: 'Literal', value: 'home.greeting' },
          { type: 'Identifier', value: 'state.greeting' }
        ]
      }
    );
  });
  test('parse with array of keys', () => {
    const code = `t(['key1', 'key2'])`;
    const tokens = tokenize(code);
    const callExpression = parse(tokens, code, '\\bt');
    expect(callExpression).toEqual(
      {
        type: 'CallExpression',
        value: "t(['key1', 'key2'])",
        arguments: [
          {
            type: 'ArrayExpression', elements: [
              {
                type: 'Literal',
                value: 'key1'
              },
              {
                type: 'Literal',
                value: 'key2'
              }
            ]
          }
        ]
      }
    );
  });
});

describe('parser: parseSequenceExpressions', () => {
  test('parseSequenceExpressions', () => {
    const code = `/*#__PURE__*/ _jsx("h1", {
      children: t('app.title')
  }),
  /*#__PURE__*/ _jsx("p", {
      children: t('home.greeting', {
          name: 'Qwik Speak'
      })
  }),`;
    const sequence = parseSequenceExpressions(code, '\\bt');
    expect(sequence).toEqual(
      [
        {
          type: 'CallExpression',
          value: "t('app.title')",
          arguments: [{ type: 'Literal', value: 'app.title' }]
        },
        {
          type: 'CallExpression',
          value: "t('home.greeting', {\n          name: 'Qwik Speak'\n      })",
          arguments: [
            { type: 'Literal', value: 'home.greeting' },
            {
              type: 'ObjectExpression', properties: [
                {
                  type: 'Property',
                  key: { type: 'Identifier', value: 'name' },
                  value: { type: 'Literal', value: 'Qwik Speak' }
                }
              ]
            }
          ]
        }
      ]
    );
  });
});

describe('alias', () => {
  test('getTranslateAlias', () => {
    let alias = getTranslateAlias(`import {
      $translate as t,
      $plural as p,
      formatDate as fd,
      formatNumber as fn,
      relativeTime as rt,
      Speak,
      useSpeakLocale
    } from 'qwik-speak';`);
    expect(alias).toBe('\\bt');
    alias = getTranslateAlias("import { $translate as t } from 'qwik-speak';");
    expect(alias).toBe('\\bt');
    alias = getTranslateAlias("import { $translate } from 'qwik-speak';");
    expect(alias).toBe('\\$translate');
  });
});
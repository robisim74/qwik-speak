import { test, describe, expect } from 'vitest';

import { getInlineTranslateAlias, getPluralAlias, getTranslateAlias, getUseTranslateAlias, parse, parseSequenceExpressions, tokenize } from '../core/parser';

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
          position: { start: 23, end: 26 }
        },
        { type: 'Punctuator', value: ':', position: { start: 27, end: 27 } },
        {
          type: 'Literal',
          value: "'Qwik Speak'",
          position: { start: 29, end: 40 }
        },
        { type: 'Punctuator', value: '}', position: { start: 42, end: 42 } },
        { type: 'Punctuator', value: ')', position: { start: 43, end: 43 } }
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
          position: { start: 23, end: 26 }
        },
        { type: 'Punctuator', value: ':', position: { start: 27, end: 27 } },
        {
          type: 'Identifier',
          value: 'name',
          position: { start: 29, end: 32 }
        },
        { type: 'Punctuator', value: '}', position: { start: 34, end: 34 } },
        { type: 'Punctuator', value: ')', position: { start: 35, end: 35 } }
      ]
    );
  });
  test('tokenize with arguments', () => {
    const code = `t('home.greeting', {
  name: name
}, 'en-US')`;
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
          position: { start: 23, end: 26 }
        },
        { type: 'Punctuator', value: ':', position: { start: 27, end: 27 } },
        {
          type: 'Identifier',
          value: 'name',
          position: { start: 29, end: 32 }
        },
        { type: 'Punctuator', value: '}', position: { start: 34, end: 34 } },
        { type: 'Punctuator', value: ',', position: { start: 35, end: 35 } },
        {
          type: 'Literal',
          value: "'en-US'",
          position: { start: 37, end: 43 }
        },
        { type: 'Punctuator', value: ')', position: { start: 44, end: 44 } }
      ]
    );
  });
  test('tokenize with undefined arguments', () => {
    const code = "t('home.greeting', undefined, 'en-US')";
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
          value: "'en-US'",
          position: { start: 30, end: 36 }
        },
        { type: 'Punctuator', value: ')', position: { start: 37, end: 37 } }
      ]
    );
  });
  test('tokenize with void 0 arguments', () => {
    const code = "t('home.greeting', void 0, 'en-US')";
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
          value: 'void 0',
          position: { start: 19, end: 24 }
        },
        { type: 'Punctuator', value: ',', position: { start: 25, end: 25 } },
        {
          type: 'Literal',
          value: "'en-US'",
          position: { start: 27, end: 33 }
        },
        { type: 'Punctuator', value: ')', position: { start: 34, end: 34 } }
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
        value: "t('home.greeting', {\n  name: 'Qwik Speak'\n})",
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
  test('parse with punctuation in params', () => {
    const code = String.raw`t('text@@{{ default }}', { default: 'Text: (){},:;.[]?!\'" punctuation'})`;
    const tokens = tokenize(code);
    const callExpression = parse(tokens, code, '\\bt');
    expect(callExpression).toEqual(
      {
        type: 'CallExpression',
        value: "t('text@@{{ default }}', { default: 'Text: (){},:;.[]?!\\'\" punctuation'})",
        arguments: [
          {
            type: 'Literal',
            value: 'text@@{{ default }}'
          },
          {
            type: 'ObjectExpression',
            properties: [
              {
                type: 'Property',
                key: {
                  type: 'Identifier',
                  value: 'default'
                },
                value: {
                  type: 'Literal',
                  value: "Text: (){},:;.[]?!\\'\" punctuation"
                }
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
}, 'en-US')`;
    const tokens = tokenize(code);
    const callExpression = parse(tokens, code, '\\bt');
    expect(callExpression).toEqual(
      {
        type: 'CallExpression',
        value: "t('home.greeting', {\n" +
          '  name: obj.name, greeting: getGreeting()\n' +
          "}, 'en-US')",
        arguments: [
          { type: 'Literal', value: 'home.greeting' },
          {
            type: 'ObjectExpression', properties: [
              {
                type: 'Property',
                key: { type: 'Identifier', value: 'name' },
                value: { type: 'Expression', value: 'obj.name' }
              },
              {
                type: 'Property',
                key: { type: 'Identifier', value: 'greeting' },
                value: { type: 'Expression', value: 'getGreeting()' }
              }
            ]
          },
          { type: 'Literal', value: 'en-US' }
        ]
      }
    );
  });
  test('parse with function call params', () => {
    const code = `t('home.greeting', getGreeting('name'))`;
    const tokens = tokenize(code);
    const callExpression = parse(tokens, code, '\\bt');
    expect(callExpression).toEqual(
      {
        type: 'CallExpression',
        value: "t('home.greeting', getGreeting('name'))",
        arguments: [
          { type: 'Literal', value: 'home.greeting' },
          { type: 'CallExpression', value: "getGreeting('name')" }
        ]
      }
    );
  });
  test('parse with function in params', () => {
    const code = `t('home.num', { val: fn(1000000, { style: 'currency' }) })`;
    const tokens = tokenize(code);
    const callExpression = parse(tokens, code, '\\bt');
    expect(callExpression).toEqual(
      {
        type: 'CallExpression',
        value: "t('home.num', { val: fn(1000000, { style: 'currency' }) })",
        arguments: [
          {
            type: 'Literal',
            value: 'home.num'
          },
          {
            type: 'ObjectExpression',
            properties: [
              {
                type: 'Property',
                key: {
                  type: 'Identifier',
                  value: 'val'
                },
                value: {
                  type: 'Expression',
                  value: "fn(1000000,{style:'currency'})"
                }
              }
            ]
          }
        ]
      }
    );
  });
  test('parse with comments in params', () => {
    const code = `t('home.date', {
  val: /* @__PURE__ */ new Date()
})`;
    const tokens = tokenize(code);
    const callExpression = parse(tokens, code, 't');
    expect(callExpression).toEqual(
      {
        type: 'CallExpression',
        value: "t('home.date', {\n  val: /* @__PURE__ */ new Date()\n})",
        arguments: [
          {
            type: 'Literal',
            value: 'home.date'
          },
          {
            type: 'ObjectExpression',
            properties: [
              {
                type: 'Property',
                key: {
                  type: 'Identifier',
                  value: 'val'
                },
                value: {
                  type: 'Expression',
                  value: 'new Date()'
                }
              }
            ]
          }
        ]
      }
    );
  });
  test('parse with conditional params', () => {
    const code = `t('home.greeting', {
  name: (_a = obj.value) == null ? void 0 : _a.name
}, 'en-US')`;
    const tokens = tokenize(code);
    const callExpression = parse(tokens, code, '\\bt');
    expect(callExpression).toEqual(
      {
        type: 'CallExpression',
        value: "t('home.greeting', {\n  name: (_a = obj.value) == null ? void 0 : _a.name\n}, 'en-US')",
        arguments: [
          {
            type: 'Literal',
            value: 'home.greeting'
          },
          {
            type: 'ObjectExpression',
            properties: [
              {
                type: 'Property',
                key: {
                  type: 'Identifier',
                  value: 'name'
                },
                value: {
                  type: 'Expression',
                  value: '(_a =obj.value)==null ?void 0 :_a.name'
                }
              }
            ]
          },
          {
            type: 'Literal',
            value: 'en-US'
          }
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
  test('parse with array of keys/identifiers', () => {
    const code = `t(['key1', key])`;
    const tokens = tokenize(code);
    const callExpression = parse(tokens, code, '\\bt');
    expect(callExpression).toEqual(
      {
        type: 'CallExpression',
        value: "t(['key1', key])",
        arguments: [
          {
            type: 'ArrayExpression', elements: [
              {
                type: 'Literal',
                value: 'key1'
              },
              {
                type: 'Identifier',
                value: 'key'
              }
            ]
          }
        ]
      }
    );
  });
  test('parse with arrow functions', () => {
    const code = `_fnSignal((p0)=>p0('home.text'), [
      t
  ])`;
    const tokens = tokenize(code);
    const callExpression = parse(tokens, code, '\\b_fnSignal');
    expect(callExpression).toEqual(
      {
        type: 'CallExpression',
        value: "_fnSignal((p0)=>p0('home.text'), [\n      t\n  ])",
        arguments: [
          {
            type: 'Identifier',
            value: 'p0'
          },
          {
            type: 'CallExpression',
            value: "p0('home.text')"
          },
          {
            type: 'ArrayExpression',
            elements: [
              {
                type: 'Identifier',
                value: 't'
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
    const code = `/*#__PURE__*/ _jsxQ("h2", null, null, t('app.subtitle'), 1, null),
/*#__PURE__*/ _jsxQ("p", null, null, t('home.greeting', {
    name: 'Qwik Speak'
}), 1, null),`;
    const sequence = parseSequenceExpressions(code, '\\bt');
    expect(sequence).toEqual(
      [
        {
          type: 'CallExpression',
          value: "t('app.subtitle')",
          arguments: [{ type: 'Literal', value: 'app.subtitle' }]
        },
        {
          type: 'CallExpression',
          value: "t('home.greeting', {\n    name: 'Qwik Speak'\n})",
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

describe('aliases', () => {
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
  test('getUseTranslateAlias', () => {
    let alias = getUseTranslateAlias(`const t = useTranslate();`);
    expect(alias).toBe('\\bt');
    alias = getUseTranslateAlias('const t$ = useTranslate();');
    expect(alias).toBe('\\bt\\$');
  });
  test('getInlineTranslateAlias', () => {
    let alias = getInlineTranslateAlias(`import {
  $inlineTranslate as t,
  useSpeakLocale
} from 'qwik-speak';`);
    expect(alias).toBe('\\bt');
    alias = getInlineTranslateAlias("import { $inlineTranslate as $translate } from 'qwik-speak';");
    expect(alias).toBe('\\$translate');
    alias = getInlineTranslateAlias("import { $inlineTranslate } from 'qwik-speak';");
    expect(alias).toBe('\\$inlineTranslate');
  });
  test('getPluralAlias', () => {
    let alias = getPluralAlias(`import {
  $translate as t,
  $plural as p,
  formatDate as fd,
  formatNumber as fn,
  relativeTime as rt,
  Speak,
  useSpeakLocale
} from 'qwik-speak';`);
    expect(alias).toBe('\\bp');
    alias = getPluralAlias("import { $plural as p} from 'qwik-speak';");
    expect(alias).toBe('\\bp');
    alias = getPluralAlias("import { $plural } from 'qwik-speak';");
    expect(alias).toBe('\\$plural');
  });
});

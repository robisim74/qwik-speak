import { tokenize } from '../core/parser';

describe('parser', () => {
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
});

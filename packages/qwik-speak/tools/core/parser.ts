import type { Translation } from './types';

export interface Property {
  type: 'Property';
  key: {
    type: 'Identifier';
    value: string;
  };
  value: {
    type: 'Literal' | 'Expression';
    value: string;
  };
}

export interface Element {
  type: 'Literal' | 'Identifier';
  value: string;
}

export interface Argument {
  type: 'Literal' | 'Identifier' | 'CallExpression' | 'ObjectExpression' | 'ArrayExpression';
  value?: string;
  properties?: Property[];
  elements?: Element[];
}

/**
 * Abstract Syntax Tree (AST) of every call expression
 */
export interface CallExpression {
  type: 'CallExpression';
  value: string;
  arguments: Argument[];
}

/**
 * Literal:
 * String literals
 * Numeric literals
 * Null literal
 * Boolean literal
 * 
 * Identifier:
 * [0-9a-zA-Z_$]
 * 
 * Punctuator:
 * [(){},:;.[]?!=<>]
 * 
 * Comment
 * [/*]
 */
export type TokenType = 'Literal' | 'Identifier' | 'Punctuator';

/**
 * Token data structure
 */
export interface Token {
  type: TokenType;
  value: string;
  position: {
    start: number;
    end: number;
  };
}

/**
 * Lexical analysis
 * t('app.title') => ['t', '(', "'app.title'", ')']
 * 
 * Start rules:
 * 'Literal': ["'`0-9+-]
 * 'Identifier': [a-zA-Z_$]
 * 'Punctuator': [(){},:;.[]?!=<>]
 * 'Comment': /*
 */
export function tokenize(code: string, start = 0): Token[] {
  const tokens: Token[] = [];

  const parenthesisStack: string[] = [];
  const quotesStack: string[] = [];

  let identifierBuffer: string = '';

  let index = start;

  const createToken = (type: TokenType): Token => {
    start = index;
    return { type: type, value: getRawValue(), position: { start: start, end: index } };
  };

  const updateToken = (token: Token) => {
    token.value = getRawValue();
    token.position.start = start;
    token.position.end = index;
  }

  const next = () => code[++index];

  const lookAhead = () => index < code.length - 1 ? code[index + 1] : '';
  const lookBehind = () => index > 0 ? code[index - 1] : '';

  const getRawValue = () => code.substring(start, index + 1);

  const startLiteral = (ch: string) => /["'`0-9+-]/.test(ch);

  const startIdentifier = (ch: string) => /[a-zA-Z_$]/.test(ch);

  const startPunctuator = (ch: string) => /[(){},:;.[\]?!=<>]/.test(ch);

  const startComment = (ch: string) => /\//.test(ch) && /\*/.test(lookAhead());

  const scanLiteral = (ch: string, token?: Token): Token[] => {
    if (!token) {
      token = createToken('Literal');
      tokens.push(token);
    } else if (quotesStack.length === 0 && !/[0-9.]/.test(ch)) {
      // No String literals or Numeric literals
      return scan(ch);
    } else {
      updateToken(token);
    }

    // Open/close quotes
    if (quotesStack.length === 0 && /["'`]/.test(ch)) {
      quotesStack.push(ch);
    } else if (quotesStack.length > 0 && quotesStack[quotesStack.length - 1] === ch) {
      // Skip escaped
      if (!/\\/.test(lookBehind())) quotesStack.pop();
    }

    return scanLiteral(next(), token);
  }

  const scanIdentifier = (ch: string, token?: Token): Token[] => {
    if (!token) {
      identifierBuffer = ch;
      token = createToken('Identifier');
      tokens.push(token);
    } else if (!/[0-9a-zA-Z_$. ]/.test(ch)) {
      // No Identifier
      return scan(ch);
    } else {
      identifierBuffer += ch;
      if (identifierBuffer == 'null' ||
        identifierBuffer == 'undefined' ||
        identifierBuffer == 'true' ||
        identifierBuffer == 'false' ||
        identifierBuffer == 'void 0') {
        token.type = 'Literal';
        updateToken(token);
      }
      else {
        updateToken(token);
      }
    }

    return scanIdentifier(next(), token);
  };

  const scanPunctuator = (ch: string, token?: Token): Token[] => {
    token = createToken('Punctuator');
    tokens.push(token);

    // Open/close parenthesis
    if (/\(/.test(ch))
      parenthesisStack.push(ch);
    else if (/\)/.test(ch))
      parenthesisStack.pop();

    return scan(next());
  };

  const scanComment = (ch: string): Token[] => {
    // Skip comment

    // Close comment
    if (/\//.test(ch) && /\*/.test(lookBehind())) {
      return scan(ch);
    }

    return scanComment(next());
  };

  const endOfScan = () => (tokens[tokens.length - 1]?.type === 'Punctuator' && parenthesisStack.length === 0) ||
    index === code.length;

  /**
   * Tail recursion
   */
  const scan = (ch = code[index]): Token[] => {
    if (endOfScan()) return tokens;

    if (startLiteral(ch)) return scanLiteral(ch);

    if (startIdentifier(ch)) return scanIdentifier(ch);

    if (startPunctuator(ch)) return scanPunctuator(ch);

    if (startComment(ch)) return scanComment(ch);

    return scan(next());
  };

  return scan();
}

/**
 * Syntax analysis
 * 
 * EBNF grammar:
 * letter = ? any letter ?;
 * digit = ? any digit ?;
 * character = ? any character ?;
 * quote = "'" | '"' | "`";
 * literal = quote, character, quote | digit | "null" | "undefined" | "true" | "false";
 * identifier = letter | "_" | "$", { digit | letter | "_" | "$" };
 * key = identifier;
 * value = literal | expression;
 * property = key, ":", value;
 * objectExpr = "{", { property, [","] }, "}";
 * element = quote, character, quote
 * arrayExpr = "[", { element, [","] }, "]";
 * args = "(", { literal | identifier | objectExpr | callExpr, [","] }, ")";
 * callExpr = alias | identifier, args;
 * 
 * Recursive Descent Parsing
 */
export function parse(tokens: Token[], code: string, alias: string): CallExpression | undefined {
  let node: CallExpression;

  let c = 0;

  const parenthesisStack: string[] = [];

  const lookAhead = () => c < tokens.length - 1 ?
    tokens[c + 1] :
    { type: '', value: '', position: { start: 0, end: 0 } };
  const next = () => tokens[++c];
  const last = () => tokens[tokens.length - 1];

  const trimQuotes = (value: string) => value.replace(/^["'`]|["'`]$/g, '');

  const parseLiteral = (token: Token): CallExpression => {
    node.arguments.push({ type: 'Literal', value: trimQuotes(token.value) });
    return parseArgs(next());
  };

  const parseIdentifier = (token: Token): CallExpression => {
    node.arguments.push({ type: 'Identifier', value: token.value });
    return parseArgs(next());
  };

  const parseProperty = (token: Token, properties: Property[], property?: Property): CallExpression => {
    if (!property) {
      property = {
        type: 'Property',
        key: { type: 'Identifier', value: token.value },
        value: { type: 'Literal', value: '' }
      };
      properties.push(property);
    }

    if (!/^:$/.test(token.value) && !/^:$/.test(lookAhead().value)) {
      if (token.type === 'Literal') {
        property.value.value = trimQuotes(token.value);
        // End of property
        return parseObject(next(), properties);
      } else {
        property.value.type = 'Expression';
        return parseExpr(token, properties, property);
      }
    }

    return parseProperty(next(), properties, property);
  };

  const parseExpr = (token: Token, properties: Property[], property: Property): CallExpression => {
    property.value.value += token.value;

    if (/^[({]$/.test(token.value))
      parenthesisStack.push(token.value);
    else if (/^[)}]$/.test(token.value))
      parenthesisStack.pop()

    // End of property
    if (/^[,}]$/.test(lookAhead().value) && parenthesisStack.length === 0) return parseObject(next(), properties);

    return parseExpr(next(), properties, property);
  }

  const parseObject = (token: Token, properties?: Property[]): CallExpression => {
    if (!properties) {
      properties = [];
      node.arguments.push({ type: 'ObjectExpression', properties: properties });
    }

    // End of object
    if (/^}$/.test(token.value)) return parseArgs(next());

    if (/^:$/.test(lookAhead().value)) return parseProperty(token, properties)

    return parseObject(next(), properties);
  };

  const parseArrayExpr = (token: Token, elements?: Element[]): CallExpression => {
    if (!elements) {
      elements = [];
      node.arguments.push({ type: 'ArrayExpression', elements: elements });
    }

    // End of array
    if (/^]$/.test(token.value)) return parseArgs(next());

    if (token.type === 'Literal') {
      elements.push({ type: 'Literal', value: trimQuotes(token.value) });
    }
    if (token.type === 'Identifier') {
      elements.push({ type: 'Identifier', value: token.value });
    }

    return parseArrayExpr(next(), elements);
  };

  const parseArgs = (token: Token): CallExpression => {
    if (Object.is(token, last())) return node;

    if (token.type === 'Literal') return parseLiteral(token);
    if (token.type === 'Identifier' && /^\($/.test(lookAhead().value)) return parseCallExpr(token);
    if (token.type === 'Identifier') return parseIdentifier(token);
    if (/^{$/.test(token.value)) return parseObject(token);
    if (/^\[$/.test(token.value)) return parseArrayExpr(token);

    return parseArgs(next());
  };

  const parseCallExpr = (token: Token, arg?: Argument, start = token.position.start): CallExpression => {
    if (!arg) {
      if (new RegExp(alias).test(token.value)) {
        // Alias Call expression
        node = {
          type: 'CallExpression',
          value: code.substring(start, last().position.end + 1),
          arguments: []
        };
        return parseArgs(next());
      } else {
        // Call expressions
        arg = { type: 'CallExpression', value: '' };
        node.arguments.push(arg);
        return parseCallExpr(next(), arg, start)
      }
    }

    // End of call
    if (/^\)$/.test(token.value)) {
      // Call expressions are inlined
      arg.value = code.substring(start, token.position.end + 1);

      return parseArgs(next());
    }

    return parseCallExpr(next(), arg, start)
  }

  return parseCallExpr(tokens[c]);
}

export function findIndexes(code: string, alias: string) {
  const regex = new RegExp(`${alias}\\(`, 'gs');
  const indexes = [];
  let match;

  while ((match = regex.exec(code)) !== null) {
    indexes.push(match.index);
  }

  return indexes;
}

/**
 * Parse in the code the sequence of functions defined by the alias
 */
export function parseSequenceExpressions(code: string, alias: string): CallExpression[] {
  const sequenceExpressions: CallExpression[] = [];

  const indexes = findIndexes(code, alias);

  for (const i of indexes) {
    const tokens = tokenize(code, i);
    if (tokens.length > 0) {
      try {
        const callExpression = parse(tokens, code, alias);
        if (callExpression) sequenceExpressions.push(callExpression);
      } catch (ex: any) {
        // Report Call expression
        console.error(ex);
        console.error('\x1b[31m\nQwik Speak Inline error parsing \x1b[0m %s',
          code.substring(i, tokens[tokens.length - 1].position.end) +
          '\n');
      }
    }
  }

  return sequenceExpressions;
}

/**
 * Get useTranslate alias
 */
export function getUseTranslateAlias(code: string): string | null {
  let translateAlias = code.match(/(?<=\bconst\s).*?(?=\s?=\s?useTranslate\(\);?)/)?.[0]?.trim();
  if (!translateAlias) return null;
  // Assert position at a word boundary
  if (!translateAlias.startsWith('$')) translateAlias = `\\b${translateAlias}`;
  // Escape special characters 
  translateAlias = translateAlias.replace(/\$/g, '\\$');
  return translateAlias;
}

/**
 * Get inlineTranslate alias
 */
export function getInlineTranslateAlias(code: string): string {
  let translateAlias = code.match(/(?<=inlineTranslate\s+as).*?(?=,|\})/s)?.[0]?.trim() || 'inlineTranslate';
  // Assert position at a word boundary
  if (!translateAlias.startsWith('$')) translateAlias = `\\b${translateAlias}`;
  // Escape special characters 
  translateAlias = translateAlias.replace(/\$/g, '\\$');
  return translateAlias;
}

/**
 * Get usePlural alias
 */
export function getUsePluralAlias(code: string): string | null {
  let pluralAlias = code.match(/(?<=\bconst\s).*?(?=\s?=\s?usePlural\(\);?)/)?.[0]?.trim();
  if (!pluralAlias) return null;
  // Assert position at a word boundary
  if (!pluralAlias.startsWith('$')) pluralAlias = `\\b${pluralAlias}`;
  // Escape special characters 
  pluralAlias = pluralAlias.replace(/\$/g, '\\$');
  return pluralAlias;
}

/**
 * Parse source removing null and empty values
 */
export function parseJson(source: string): Translation {
  return JSON.parse(source, (key, value) => value === null || value === '' ? undefined : value);
}

export interface Property {
  type: 'Property';
  key: {
    type: 'Identifier';
    value: string;
  };
  value: {
    type: 'Literal' | 'Identifier' | 'CallExpression';
    value: string;
  };
}

export interface Argument {
  type: 'Literal' | 'Identifier' | 'ObjectExpression';
  value?: string;
  properties?: Property[];
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
 * [(){},:;.[]?!]
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
 * 'Literal': ["'`0-9]
 * 'Identifier': [a-zA-Z_$]
 * 'Punctuator': [(){},:;.[]?!]
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

  const getRawValue = () => code.substring(start, index + 1);

  const startLiteral = (ch: string) => /["'`0-9]/.test(ch);

  const startIdentifier = (ch: string) => /[a-zA-Z_$]/.test(ch);

  const startPunctuator = (ch: string) => /[(){},:;.[\]?!]/.test(ch);

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
    if (quotesStack.length === 0 && /["'`]/.test(ch))
      quotesStack.push(ch);
    else if (quotesStack.length > 0 && quotesStack[quotesStack.length - 1] === ch)
      quotesStack.pop();
    // Escaped quotes
    if (/\\/.test(ch))
      quotesStack.push(ch);
    else if (/["'`]/.test(ch) && /\\/.test(quotesStack[quotesStack.length - 1]))
      quotesStack.pop();

    return scanLiteral(next(), token);
  }

  const scanIdentifier = (ch: string, token?: Token): Token[] => {
    if (!token) {
      identifierBuffer = ch;
      token = createToken('Identifier');
      tokens.push(token);
    } else if (!/[0-9a-zA-Z_$]/.test(ch)) {
      // No Identifier
      return scan(ch);
    } else {
      identifierBuffer += ch;
      if (identifierBuffer == 'null' ||
        identifierBuffer == 'undefined' ||
        identifierBuffer == 'true' ||
        identifierBuffer == 'false') {
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
 * literal = quote, character, quote | digit | "null" | "undefined" | "true" | "false"
 * identifier = letter, { letter | digit | "_" | "$" };
 * key = identifier
 * value = literal | identifier ["." | "?." | "!.", identifier, [!]] | callExpr;
 * property = key, ":", value
 * objectExpr = "{", { property, [","] }, "}";
 * args = "(", { literal | identifier | objectExpr, [","] }, ")";
 * callExpr = alias, args;
 * 
 * Recursive Descent Parsing
 */
export function parse(tokens: Token[], code: string, alias: string): CallExpression | undefined {
  let node: CallExpression;

  let c = 0;

  const lookAhead = () => tokens[c + 1];
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
        key: { type: 'Identifier', value: token.value }, value: { type: 'Literal', value: '' }
      };
      properties.push(property);
    }

    if (!/:/.test(token.value) && !/:/.test(lookAhead().value)) {
      if (token.type === 'Literal') {
        property.value.value = trimQuotes(token.value);
      } else {
        property.value.type = /[()]/.test(token.value) ? 'CallExpression' : 'Identifier';
        property.value.value += token.value;
      }

      if (/[,}]/.test(lookAhead().value)) return parseObject(next(), properties);
    }

    return parseProperty(next(), properties, property);
  };

  const parseObject = (token: Token, properties?: Property[]): CallExpression => {
    if (!properties) {
      properties = [];
      node.arguments.push({ type: 'ObjectExpression', properties: properties });
    }

    // End of object
    if (/}/.test(token.value)) return parseArgs(next());

    if (!/{/.test(token.value))
      if (/:/.test(lookAhead().value)) return parseProperty(token, properties)

    return parseObject(next(), properties);
  };

  const parseArgs = (token: Token): CallExpression => {
    if (Object.is(token, last())) return node;

    if (token.type === 'Literal') return parseLiteral(token);
    if (token.type === 'Identifier') return parseIdentifier(token);
    if (/{/.test(token.value)) return parseObject(token);

    return parseArgs(next());
  };

  const parseCallExpr = (token = tokens[c]): CallExpression | undefined => {
    if (token.type === 'Identifier' && new RegExp(alias).test(token.value)) {
      node = {
        type: 'CallExpression',
        value: code.substring(token.position.start, last().position.end + 1),
        arguments: []
      };
      return parseArgs(next());
    }
  }

  return parseCallExpr();
}

/**
 * Parse in the code the sequence of functions defined by the alias
 */
export function parseSequenceExpressions(code: string, alias: string): CallExpression[] {
  const sequenceExpressions: CallExpression[] = [];

  let i = 0;
  let p = 0;
  do {
    i = code.slice(p).search(new RegExp(`${alias}\\(`, 'gs'));

    if (i >= 0) {
      const tokens = tokenize(code, i + p);
      if (tokens.length > 0) {
        const callExpression = parse(tokens, code, alias);
        if (callExpression) sequenceExpressions.push(callExpression);

        p = tokens[tokens.length - 1].position.end;
      }
      else {
        break;
      }
    }

  } while (i >= 0);

  return sequenceExpressions;
}

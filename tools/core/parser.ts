/**
 * Abstract Syntax Tree (AST) of every function
 */
export interface CallExpression {
    type: 'CallExpression';
    value: string;
    arguments: {
        type: 'Literal' | 'ObjectExpression' | 'Identifier';
        value: string;
    } | {
        type: 'ObjectExpression';
        properties: {
            type: 'Property' | 'Identifier';
            key: {
                type: 'Identifier';
                value: string;
            };
            value: {
                type: 'Literal' | 'Identifier';
                value: string;
            };
        }[];
    }[];
}

export type TokenType = 'Identifier' | 'Literal' | 'Punctuator';

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
 * Rules:
 * 'Identifier': [a-zA-Z_$]
 * 'Literal': ["'`0-9]
 * 'Punctuator': [(){},:]
 * @param code 
 */
export function tokenize(code: string): Token[] {
    const tokens: Token[] = [];

    const parenthesisStack: string[] = [];
    const quotesStack: string[] = [];

    let start = 0;
    let index = 0;

    let token: Token;

    const getRawValue = (): string => code.substring(start, index + 1);

    const scanIdentifier = (ch: string): boolean => {
        return /[a-zA-Z_$]/.test(ch) || (token?.type === 'Identifier' && /[0-9a-zA-Z_$]/.test(ch));
    };

    const scanLiteral = (ch: string): boolean => {
        return /["'`0-9]/.test(ch) || (token?.type === 'Literal' && quotesStack.length > 0);
    };

    const scanPunctuator = (ch: string): boolean => /[(){},:]/.test(ch);

    const nextToken = (type: TokenType) => {
        start = index;
        token = { type: type, value: getRawValue(), position: { start: start, end: index } };
        tokens.push(token);
    };

    const updateToken = () => {
        token.value = getRawValue();
        token.position.start = start;
        token.position.end = index;
    }

    const endOfScan = () => (token.type === 'Punctuator' && parenthesisStack.length === 0) || index === code.length;

    const scan = (): Token[] => {
        const ch = code[index];

        if (scanLiteral(ch)) {
            if (token?.type !== 'Literal')
                nextToken('Literal');
            else
                updateToken();

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
        }
        else if (scanIdentifier(ch)) {
            if (token?.type !== 'Identifier')
                nextToken('Identifier');
            else
                updateToken();
        } else if (scanPunctuator(ch)) {
            nextToken('Punctuator');

            // Open/close parenthesis
            if (/\(/.test(ch))
                parenthesisStack.push(ch);
            else if (/\)/.test(ch))
                parenthesisStack.pop();
        }

        index++;

        return endOfScan() ? tokens : scan();
    };

    return scan();
}

/**
 * Syntax analysis
 * @param tokens 
 */
export function parse(tokens: Token[]): any {
    return null;
}

/**
 * Parse in the code the sequence of functions defined by the alias
 * @param code 
 * @param alias
 */
export function parseSequenceExpressions(code: string, alias: string): CallExpression[] {
    const sequenceExpressions: CallExpression[] = [];

    let i = 0;
    let p = 0;
    do {
        i = code.slice(p).search(new RegExp(`${alias}\\(`, 'gs'));

        if (i >= 0) {
            code = code.substring(i);

            const tokens = tokenize(code);
            if (tokens.length > 0) {
                const callExpression = parse(tokens);
                sequenceExpressions.push(callExpression);

                p = tokens[tokens.length - 1].position.end;
            }
            else {
                break;
            }
        }

    } while (i >= 0);

    return sequenceExpressions;
}

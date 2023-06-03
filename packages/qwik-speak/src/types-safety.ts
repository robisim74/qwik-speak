type Cleanup<T> =
  0 extends (1 & T)
  ? unknown
  : T extends readonly any[]
  ? (Exclude<keyof T, keyof any[]> extends never
    ? { [k: `${number}`]: T[number] } : Omit<T, keyof any[]>)
  : T;

type PrefixKeys<V, K extends PropertyKey, D extends string, O> =
  V extends O
  ? { [P in K]: V }
  : V extends object
  ? { [P in keyof V as `${Extract<K, string | number>}${D}${Extract<P, string | number>}`]: V[P] }
  : { [P in K]: V };

type ValueOf<T> = T[keyof T];

type Flatten<T, D extends string, O> = Cleanup<T> extends infer U
  ? (U extends O
    ? U
    : U extends object
    ? (ValueOf<{ [K in keyof U]: (x: PrefixKeys<Flatten<U[K], D, O>, K, D, O>) => void }>
      | ((x: U) => void) extends (x: infer I) => void
      ? { [K in keyof I]: I[K] }
      : never)
    : U)
  : never;

type PrefixKeysWithSuffix<T extends string, S extends string> = T extends `${infer U}.${infer Rest}`
  ? `${U}${S}.${PrefixKeysWithSuffix<Rest, S>}`
  : `${T}${S}`;

type AddSuffix<T extends string, S extends string> = T extends keyof any
  ? `${T}${S}`
  : PrefixKeysWithSuffix<T, S>;

type Split<T, O> = keyof T extends infer Keys
  ? (Keys extends PropertyKey
    ? (Keys extends keyof T
      ? (T[Keys] extends O | O[] ? Keys : never) // Compare return type
      : never)
    : never)
  : never

type Paths<T, D extends string, O> = Split<Flatten<T, D, O>, O>;

/**
 * Make translations type safe
 * @template T Translation type
 * @template D Separator of nested keys. Default is '.'
 * @template S Key-value separator. Default is '@@'
 */
export type TranslationType<T, D extends string = '.', S extends string = '@@', O = string> =
  T extends string
  ? T
  :
  | Paths<T, D, O>
  | AddSuffix<Paths<T, D, O>, `${S}${string}`>;

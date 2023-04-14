/**
 *  A type alias that cannot be used interchangeably with other aliases for the same base type T where
 *  T is the base type and K is a unique identifier.
 *
 *  The purpose of this type is to enable the creation of 'opaque' or 'nominal' types.
 *  Read more:
 *   https://codemix.com/opaque-types-in-javascript/
 *   https://github.com/microsoft/TypeScript/issues/202
 */
export type Opaque<T, K> = T & { __KEY__: K }

export type AnyFunction = (...args: any[]) => any

export type PropsWithClassName = {
  className?: string | undefined
}

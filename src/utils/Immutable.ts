/**
 * forbids manipulation for the wrapped type (recursive)
 * but i guess its not hard enough against typecasting
 *
 *
 * credits and thanks to https://templecoding.com/blog/real-immutable-types-with-typescript
 * --> original
 * fails to be compatible to "Date"-Objects
 *
 * const b: Immutable<Date> = new Date(1);
 * const asd: Date = b; // Error
 *
 * --> workaround
 * adding "T &" {...
 *
 *
 * @format
 */

export type Immutable<T> = T & { readonly [K in keyof T]: Immutable<T[K]> };

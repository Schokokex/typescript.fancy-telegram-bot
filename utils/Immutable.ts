/**
 * 
 * forbids manipulation for the wrapped type (recursive)
 * but i guess its not hard enough against typecasting
 * 
 * 
 * credits and thanks to https://templecoding.com/blog/real-immutable-types-with-typescript
 */
export type Immutable<T> = {
    readonly [K in keyof T]: Immutable<T[K]>;
}
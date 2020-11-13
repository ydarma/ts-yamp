type Ctor<T, S extends unknown[]> = new (...args: S) => T;
type Ftor<T, S extends unknown[]> = (this: T, ...args: S) => void;
type fn = (...args: unknown[]) => unknown;
type FunctOf<T> = {
    [K in keyof T]: T[K] extends fn ? K : never;
}[keyof T];
type ProtoOf<T> = Pick<T, FunctOf<T>>;
interface MixinBuilder<T, S extends unknown[]> {
    get(): Ctor<T, S>;
    readonly prototype: ProtoOf<T>;
    with<U, R extends unknown[]>(builder: MixinBuilder<U, R>): MixinBuilder<T & U, S>;
    with<U, R extends unknown[]>(trait: Ctor<U, R>): MixinBuilder<T & U, S>;
}
interface Mixin {
    <T, S extends unknown[]>(ftor: Ftor<T, S>): MixinBuilder<T, S>;
    <T, S extends unknown[]>(ctor: Ctor<T, S>): MixinBuilder<T, S>;
    with<T, S extends unknown[]>(ftor: Ftor<T, S>): MixinBuilder<T, S>;
    with<T, S extends unknown[]>(ctor: Ctor<T, S>): MixinBuilder<T, S>;
}
declare const mixin: Mixin;
export { mixin };

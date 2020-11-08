import { Ctor, Ftor, extend } from "./extend";

export function mixin<T, S extends unknown[], U, R extends unknown[]>(t: Ftor<T, S>, u: Ftor<U, R>, ...params: R): Ctor<T & U, S> { 
    const tCtor = t as Ctor<T, S>
    const uCtor = u as Ctor<U, R>
    const fn = function(this: T & U, ...args: S) {
        Object.assign(this, new uCtor(...params), new tCtor(...args));
    };
    return extend(extend(fn, t), u);
}
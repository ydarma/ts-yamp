import { mixin as pmixin, Ctor, Ftor } from "./mixin";

export function mixin<T, S extends unknown[], U, R extends unknown[]>(
  t: Ctor<T, S>,
  u: Ctor<U, R>,
  ...params: R
): Ctor<T & U, S> {
  const fn = function (this: T & U, ...args: S) {
    Object.assign(this, new u(...params), new t(...args));
  };
  return pmixin(t, u, fn);
}

export function constr<T, S extends unknown[], R extends unknown[]>(
  t: Ftor<T, S>,
  u: Ctor<T, R>,
  ...params: R
): Ctor<T, S> {
  return mixin(t as Ctor<T, S>, u, ...params);
}

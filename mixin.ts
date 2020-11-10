import { mixin as pmixin, constr as pconstr, Ctor, Ftor } from "./extend";

export function mixin<T, S extends unknown[], U, R extends unknown[]>(
  t: Ctor<T, S>,
  u: Ctor<U, R>,
  ...params: R
): Ctor<T & U, S> {
  const fn = function (this: T & U, ...args: S) {
    Object.assign(this, new u(...params), new t(...args));
  };
  return pconstr(fn, pmixin(t, u));
}

export function constr<T, S extends unknown[], R extends unknown[]>(
  t: Ftor<T, S>,
  u: Ctor<T, R>,
  ...params: R
): Ctor<T, S> {
  return mixin(t as Ctor<T, S>, u, ...params);
}

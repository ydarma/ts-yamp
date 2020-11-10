export type Ctor<T, S extends unknown[]> = new (...args: S) => T;
export type Ftor<T, S extends unknown[]> =
  | Ctor<T, S>
  | ((this: T, ...args: S) => void);

export function mixin<T, S extends unknown[], U>(
  t: Ctor<T, S>,
  u: Ftor<U, unknown[]>
): Ctor<T & U, S> {
  Object.getOwnPropertyNames(u.prototype).forEach((m) => {
    if (!(m in t.prototype)) {
      Object.defineProperty(
        t.prototype,
        m,
        Object.getOwnPropertyDescriptor(u.prototype, m)
      );
    }
  });
  return t as Ctor<T & U, S>;
}

export function constr<T, S extends []>(
  t: Ftor<T, S>,
  u: Ctor<T, unknown[]>
): Ctor<T, S> {
  return mixin(t as Ctor<T, S>, u);
}

export type Ctor<T, S extends unknown[]> = new (...args: S) => T;
export type Ftor<T, S extends unknown[]> =
  | Ctor<T, S>
  | ((this: T, ...args: S) => void);

export function mixin<T, S extends unknown[], U, R extends unknown[] = S>(
  t: Ctor<T, S>,
  u: Ctor<U, unknown[]>,
  constr?: Ftor<T & U, R>
): Ctor<T & U, R> {
  Object.getOwnPropertyNames(u.prototype).forEach((m) => {
    if (!(m in t.prototype)) {
      Object.defineProperty(
        t.prototype,
        m,
        Object.getOwnPropertyDescriptor(u.prototype, m)
      );
    }
  });
  if (typeof constr !== "undefined") return mixin(constr as Ctor<T & U, R>, t);
  return (t as unknown) as Ctor<T & U, R>;
}

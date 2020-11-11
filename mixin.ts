interface Ctor<T, S extends unknown[]> {
  new (...args: S): T;
}

interface Mixin<T, S extends unknown[]> extends Ctor<T, S> {
  with<U>(u: Ctor<U, unknown[]>): Mixin<T & U, S>;
}

function mixin<T, S extends unknown[], U>(
  t: Ctor<T, S>,
  u: Ctor<U, unknown[]>
) {
  Object.getOwnPropertyNames(u.prototype).forEach((m) => {
    if (!(m in t.prototype)) {
      Object.defineProperty(
        t.prototype,
        m,
        Object.getOwnPropertyDescriptor(u.prototype, m)
      );
    }
  });
  return t;
}

export default function mix<T, S extends unknown[]>(
  t?: Ctor<T, S> | ((this: T, ...args: S) => void)
): Mixin<T, S> {
  const mixed = (t ?? class {}) as Ctor<T, S>;
  const withImpl = {
    value: function <U>(u: Ctor<U, unknown[]>) {
      return mixin(mixed, u);
    },
    writable: false,
    enumerable: false,
    configurable: false,
  };
  Object.defineProperty(mixed, "with", withImpl);
  return mixed as Mixin<T, S>;
}

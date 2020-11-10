export type Ctor<T, S extends unknown[]> = new (...args: S) => T;

interface Mixed {
  _okToBeMixed_(): "ok";
}

const mixedImpl = {
  value: function () {
    return <const>"ok";
  },
  writable: false,
  enumerable: false,
  configurable: false,
};

export function mixed<T, S extends unknown[]>(
  t?: Ctor<T, S> | ((this: T, ...args: S) => void)
): Ctor<T & Mixed, S> {
  const ret = t ?? class {};
  Object.defineProperty(ret.prototype, "_okToBeMixed_", mixedImpl);
  return ret as Ctor<T & Mixed, S>;
}

export default function mixin<T extends Mixed, S extends unknown[], U>(
  t: Ctor<T, S>,
  u: Ctor<U, unknown[]>
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

interface Ctor<T, S extends unknown[]> {
  new (...args: S): T;
}

interface Mixin<T, S extends unknown[]> extends Ctor<T, S> {
  with<U>(u: Ctor<U, unknown[]>): Mixin<T & U, S>;
}

function mix<T, S extends unknown[], U>(t: Ctor<T, S>, u: Ctor<U, unknown[]>) {
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

export function mixx<T, S extends unknown[]>(
  t?: Ctor<T, S> | ((this: T, ...args: S) => void)
): Mixin<T, S> {
  const mixed = (t ?? class {}) as Ctor<T, S>;
  const withImpl = {
    value: function <U>(u: Ctor<U, unknown[]>) {
      return mix(mixed, u);
    },
    writable: false,
    enumerable: false,
    configurable: false,
  };
  Object.defineProperty(mixed, "with", withImpl);
  return mixed as Mixin<T, S>;
}

class MixinBuilder<T, S extends unknown[]> {
  constructor(private ctor: Ctor<T, S>) {}

  get(): Ctor<T, S> {
    return this.ctor;
  }

  with<U>(u: Ctor<U, unknown[]>): MixinBuilder<T & U, S> {
    return new MixinBuilder(mix(this.ctor, u));
  }
}

export default function mixin<T, S extends unknown[]>(
  t?: Ctor<T, S> | ((this: T, ...args: S) => void)
): MixinBuilder<T, S> {
  const mixed = (t ?? class {}) as Ctor<T, S>;
  return new MixinBuilder(mixed);
}

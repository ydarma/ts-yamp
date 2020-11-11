interface Ctor<T, S extends unknown[]> {
  new (...args: S): T;
}

interface Mixin<T, S extends unknown[]> extends Ctor<T, S> {
  with<U>(u: Ctor<U, unknown[]>): Mixin<T & U, S>;
}

export function mixWith<T, S extends unknown[], U>(
  t: Ctor<T, S>,
  u: Ctor<U, unknown[]>
): Ctor<T & U, S> {
  return mixer<T, S, U>(t)(u);
}

export function mixx<T, S extends unknown[]>(
  t?: Ctor<T, S> | ((this: T, ...args: S) => void)
): Mixin<T, S> {
  const mixed = (t ?? class {}) as Ctor<T, S>;
  const withImpl = {
    value: mixer(mixed),
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
    return new MixinBuilder(this.mixWith(u));
  }

  private mixWith: <U>(u: Ctor<U, unknown[]>) => Ctor<T & U, S> = mixer(
    this.ctor
  );
}

export default function mixin<T, S extends unknown[]>(
  t?: Ctor<T, S> | ((this: T, ...args: S) => void)
): MixinBuilder<T, S> {
  const mixed = (t ?? class {}) as Ctor<T, S>;
  return new MixinBuilder(mixed);
}

function mixer<T, S extends unknown[], U>(
  t: Ctor<T, S>
): (u: Ctor<U, unknown[]>) => Ctor<T & U, S> {
  return function (u: Ctor<U, unknown[]>) {
    Object.getOwnPropertyNames(u.prototype)
      .filter((m) => !(m in t.prototype))
      .forEach((m) => {
        Object.defineProperty(
          t.prototype,
          m,
          Object.getOwnPropertyDescriptor(u.prototype, m)
        );
      });
    return t as Ctor<T & U, S>;
  };
}

interface Ctor<T, S extends unknown[]> {
  new (...args: S): T;
}

interface Mixin<T, S extends unknown[]> extends Ctor<T, S> {
  with<U>(u: Ctor<U, unknown[]>): Mixin<T & U, S>;
}

export interface Super {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  super(): any;
}

export function mixWith<T, S extends unknown[], U>(
  t: Ctor<T, S>,
  u: Ctor<U, unknown[]>
): Ctor<T & U, S> {
  return mixer<T, S, U>(t)(u);
}

export function _mixin<T, S extends unknown[]>(
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

class MixinBuilder<T, S extends unknown[], K> {
  constructor(private ctor: Ctor<T, S>, private proto?: Ctor<K, never>) {}

  get(): Ctor<T & K, S> {
    return mixer<T, S, K>(this.ctor)(this.proto);
  }

  with<U>(u: Ctor<U, unknown[]>): MixinBuilder<T, S, K & U> {
    const proto = mixer(this.proto)(u);
    const builder = new MixinBuilder(this.ctor, proto);
    return builder as MixinBuilder<T & U, S, K & U>;
  }
}

export default function mixin<T, S extends unknown[]>(
  t?: Ctor<T, S> | ((this: T, ...args: S) => void)
): MixinBuilder<T, S, Super> {
  const mixed = (t ?? class {}) as Ctor<T, S>;
  class superImpl implements Super {
    super() {
      return superImpl.prototype;
    }
  }
  return new MixinBuilder(mixed, superImpl);
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

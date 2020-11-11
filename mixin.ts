interface Ctor<T, S extends unknown[]> {
  new (...args: S): T;
}

export interface Mixin {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  super(): any;
}

export function mixWith<T, S extends unknown[], U>(
  ctor: Ctor<T, S>,
  trait: Ctor<U, unknown[]>
): Ctor<T & U, S> {
  Object.getOwnPropertyNames(trait.prototype)
    .filter((m) => !(m in ctor.prototype))
    .forEach((m) => {
      Object.defineProperty(
        ctor.prototype,
        m,
        Object.getOwnPropertyDescriptor(trait.prototype, m)
      );
    });
  return ctor as Ctor<T & U, S>;
}

class MixinBuilder<T, S extends unknown[], K> {
  constructor(private ctor: Ctor<T, S>, private proto?: Ctor<K, never>) {}

  get(): Ctor<T & K, S> {
    return mixWith(this.ctor, this.proto);
  }

  with<U>(trait: Ctor<U, unknown[]>): MixinBuilder<T, S, K & U> {
    const proto = mixWith(this.proto, trait);
    const builder = new MixinBuilder(this.ctor, proto);
    return builder;
  }
}

export default function mixin<T, S extends unknown[] = never>(
  ctor?: Ctor<T, S> | ((this: T, ...args: S) => void)
): MixinBuilder<T, S, Mixin> {
  class superImpl implements Mixin {
    super() {
      return superImpl.prototype;
    }
  }
  const mixed = (ctor ?? class {}) as Ctor<T, S>;
  return new MixinBuilder(mixed, superImpl);
}

interface Ctor<T, S extends unknown[]> {
  new (...args: S): T;
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

class MixinBuilder<T, S extends unknown[]> {
  constructor(private ctor: Ctor<T, S>) {}

  get(): Ctor<T, S> {
    return this.ctor;
  }

  get super(): T {
    return this.ctor.prototype;
  }

  with<U>(builder: MixinBuilder<U, unknown[]>): MixinBuilder<T & U, S>;
  with<U>(trait: Ctor<U, unknown[]>): MixinBuilder<T & U, S>;
  with(x) {
    const trait = x instanceof MixinBuilder ? x.get() : x;
    const ctor = mixWith(this.ctor, trait);
    const builder = new MixinBuilder(ctor);
    return builder;
  }
}

interface Mixin {
  <T, S extends unknown[] = never>(
    ctor?: Ctor<T, S> | ((this: T, ...args: S) => void)
  ): MixinBuilder<T, S>;
  with<T, S extends unknown[] = never>(ctor: Ctor<T, S>);
}

const mixin = function <T, S extends unknown[] = never>(
  ctor?: Ctor<T, S> | ((this: T, ...args: S) => void)
): MixinBuilder<T, S> {
  const mixed = (ctor ?? class {}) as Ctor<T, S>;
  return new MixinBuilder(mixed);
};

mixin.with = function <T, S extends [] = never>(ctor: Ctor<T, S>) {
  return mixin().with(ctor);
};

export default mixin as Mixin;

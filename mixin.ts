type Ctor<T, S extends unknown[]> = new (...args: S) => T;
type Ftor<T, S extends unknown[]> = (this: T, ...args: S) => void;

function mixWith<T, S extends unknown[], U>(
  ctor: Ctor<T, S>,
  trait: Ctor<U, unknown[]>
): Ctor<T & U, S> {
  Object.getOwnPropertyNames(trait.prototype)
    .filter((m) => !(m in ctor.prototype))
    .forEach(copy);
  return ctor as Ctor<T & U, S>;

  function copy(prop: string) {
    Object.defineProperty(
      ctor.prototype,
      prop,
      Object.getOwnPropertyDescriptor(trait.prototype, prop)
    );
  }
}

type fn = (...args: unknown[]) => unknown;
type FunctOf<T> = {
  [K in keyof T]: T[K] extends fn ? K : never;
}[keyof T];

class MixinBuilder<T, S extends unknown[]> {
  constructor(private ctor: Ctor<T, S>) {}

  get(): Ctor<T, S> {
    return this.ctor;
  }

  get super(): Pick<T, FunctOf<T>> {
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

function mixin<T, S extends unknown[]>(ctor: Ftor<T, S>): MixinBuilder<T, S>;
function mixin<T, S extends unknown[]>(ctor: Ctor<T, S>): MixinBuilder<T, S>;
function mixin<T, S extends unknown[]>(ctor: never): MixinBuilder<T, S> {
  return new MixinBuilder(ctor);
}

mixin.with = function <T, S extends unknown[]>(ctor: Ctor<T, S>) {
  return mixin(class {}).with(ctor);
};

export default mixin;

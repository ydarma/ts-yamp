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
      Object.getOwnPropertyDescriptor(
        trait.prototype,
        prop
      ) as PropertyDescriptor
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

  get prototype(): Pick<T, FunctOf<T>> {
    return this.ctor.prototype;
  }

  with<U, R extends unknown[]>(
    builder: MixinBuilder<U, R>
  ): MixinBuilder<T & U, S>;
  with<U, R extends unknown[]>(trait: Ctor<U, R>): MixinBuilder<T & U, S>;
  with<U, R extends unknown[]>(x: unknown) {
    const trait = x instanceof MixinBuilder ? x.get() : (x as Ctor<U, R>);
    const ctor = mixWith(this.ctor, trait);
    const builder = new MixinBuilder(ctor);
    return builder;
  }
}

function mixin<T, S extends unknown[]>(ftor: Ftor<T, S>): MixinBuilder<T, S>;
function mixin<T, S extends unknown[]>(ctor: Ctor<T, S>): MixinBuilder<T, S>;
function mixin<T, S extends unknown[]>(ctor: unknown): MixinBuilder<T, S> {
  return new MixinBuilder(ctor as Ctor<T, S>);
}

function mWith<T, S extends unknown[]>(ftor: Ftor<T, S>): MixinBuilder<T, S>;
function mWith<T, S extends unknown[]>(ctor: Ctor<T, S>): MixinBuilder<T, S>;
function mWith<T, S extends unknown[]>(ctor: unknown): MixinBuilder<T, S> {
  return mixin(class {}).with(ctor as Ctor<T, S>);
}

mixin.with = mWith;

export { mixin };

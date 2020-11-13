# yamp
Yet another mixin pattern (in TypeScript).

TypeScript Handbook recommends two [mixin patterns](https://www.typescriptlang.org/docs/handbook/mixins.html). In my humble opinion the [alternative pattern](https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern) is closer to what a mixin should be : prototype of mixins are included in the target class prototype. The fact is the proposed implementation is not type safe ; this project aims to build mixins this way but with type safety.

## Install

## Usage

In the following example the `Bird` class includes the `Singer` mixin :
```typescript
import { mixin } from "mixin";

class Singing {
  constructor(public when?: string) {}

  sing(): string {
    return `I sing like a bird ${this.when ?? "in the morning."}`;
  }
}

class Bird {
  constructor(public name: string) {}
}

const SingingBird = mixin(Bird).with(Singing).get();
const bird = new SingingBird("Tweety");
console.log(bird.sing());
// I sing like a bird in the morning.
```
The `sing` method is added to the `Bird` class prototype. Actually `Bird` and `SingingBrid` references the same class but the second has type `Bird & Singing` type.
```typescript
console.log(SingingBird == Bird);
// true
```

In order to prevent `Bird` class to be modified, another receiver class should be provided :
```typescript
const SingingBird = mixin(class box {})
  .with(Bird)
  .with(Singing)
  .get();

const bird = new SingingBird();
```
Now, `SingingBird` has type `box & Bird & Singing` and references the same class as `box` declared inline in the `mixin` function call. An empty constructor function can also be passed to the `mixin` function :
```typescript
const t = mixin(function () {})
  .with(Bird)
  .with(Singing)
  .get();
```

The constructor function may be used to initialize the class instances :
```typescript
function birdCtor(this: Bird & Singing, name: string, when?: string) {
  this.name = name;
  this.when = when ?? "when I want.";
}

const SingingBird = mixin(birdCtor).with(Bird).with(Singing).get();

const bird = new SingingBird("Tweety", "every day.");
console.log(bird.sing());
// I sing like a bird every day.
```
The target instance can be properly initialized by calling mixin constructors :
```typescript
function birdCtor(this: Bird & Singing, name: string, when?: string) {
  Object.assign(this, new Singing(when), new Bird(name));
}
const SingingBird = mixin(birdCtor).with(Bird).with(Singing).get();

const bird1 = new SingingBird("Tweety");
const bird2 = new SingingBird("Tweety", "every day.");
console.log(bird1.sing());
console.log(bird2.sing());
// I sing like a bird in the morning.
// I sing like a bird every day.
```
The same can be achieved using a class :
```typescript
class ABird {
  constructor(name: string, when?: string) {
    Object.assign(this, new Singing(when), new Bird(name));
  }
}
const SingingBird = mixin(ABird).with(Bird).with(Singing).get();
```
Methods can be overriden ; overriden methods won't be replaced by mixin's same name methods. The type of the mixins has to be annotated in the overriden methods signature :
```typescript
class Person {
  constructor(public name: string) {}
}

class Bob {
  constructor(when?: string) {
    Object.assign(this, new Singing(when), new Person("Bob"));
  }

  sing(this: Person & Singing) {
    return `I sing in the shower ${this.when}`;
  }
}
const BobSings = mixin(Bob).with(Person).with(Singing).get();

const bob = new BobSings("when the sun is shining.");
console.log(bob.sing());
// I sing in the shower when the sun is shining.
```
If needed the minxin orignal methods may be called from the target class. The construction of the class is simply broken down into two steps :
```typescript
const traits = mixin.with(Person).with(Singing);
class Alice {
  constructor(when?: string) {
    Object.assign(this, new Singing(when), new Person("Alice"));
  }

  sing(this: Person & Singing) {
    const wrong = traits.prototype.sing.call(this);
    return `I would like to say that ${wrong} But I don't.`;
  }
}
const AliceSings = mixin(Alice).with(traits).get();

const alice = new AliceSings();
console.log(alice.sing());
// I would like to say that I sing like a bird in the morning. But I don't.
```
Another (maybe better) way to do the same, using an intermediate mixin :
```typescript
function baseCtor(this: Person & Singing, name: string, when?: string) {
  Object.assign(this, new Singing(when), new Bird(name));
}
const Base = mixin(baseCtor).with(Person).with(Singing).get();

class Alice {
  private readonly base: Person & Singing;

  constructor(when?: string) {
    this.base = new Base("Alice", when);
    Object.assign(this, this.base);
  }

  sing() {
    const wrong = this.base.sing();
    return `I would like to say that ${wrong} But I don't.`;
  }
}
const AliceSings = mixin(Alice).with(Base).get();
```

## About the implementation

The implementation is largely based on the [alternative pattern presented in TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern). Type are enforced by generics in the `mixWith` function that mixes two classes :

```typescript
type Ctor<T, S extends unknown[]> = new (...args: S) => T;

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
```

The `mixin` method just return an object that leverage the `mixWith` method and implements the fluent interface :
```typescript
interface MixinBuilder<T, S extends unknown[]> {
  get(): Ctor<T, S>;

  readonly prototype: ProtoOf<T>;

  with<U, R extends unknown[]>(
    builder: MixinBuilder<U, R>
  ): MixinBuilder<T & U, S>;

  with<U, R extends unknown[]>(trait: Ctor<U, R>): MixinBuilder<T & U, S>;
}
```
This makes it possible to compose several types while keeping type safety.
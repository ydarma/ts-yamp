# yamp
Yet another mixin pattern (in TypeScript).



## Install

## Usage

In the following example the `Bird` class includes the `Singer` mixin :
```typescript
import { mixin } from "mixin";

class Singing {
  constructor(public when: string = "In the morning.") {}

  sing(): string {
    return "I sing like a bird.";
  }
}

class Bird {
  constructor(public name: string) {}
}

const SingingBird = mixin(Bird).with(Singing).get();
const bird = new SingingBird("Tweety");
console.log(bird.sing());
// I sing like a bird.
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
Now, `SingingBird` has type `box & Bird & Singing` and references the same class as `box` declared inline in the `mixin` function call.

A constructor function may be passed to the `mixin`function to initialize the resulting class instances :
```typescript
function birdCtor(this: Bird & Singing, name: string, when?: string) {
  this.name = name;
  this.when = when;
}

const SingingBird = mixin(birdCtor).with(Bird).with(Singing).get();

const bird1 = new SingingBird("Tweety");
const bird2 = new SingingBird("Tweety", "All the day.");
```
The target instance can be properly initialized by calling mixin constructors :
```typescript
function birdCtor(this: Bird & Singing, name: string, when?: string) {
  Object.assign(this, new Singing(when), new Bird(name));
}
const SingingBird = mixin(birdCtor).with(Bird).with(Singing).get();
```
The same can be achieved using a class :
```typescript
class ABird {
  constructor(name: string, when?: string) {
    Object.assign(this, new Singing(when), new Bird(name));
  }
}
const SingingBird = mixin(ABird).with(Bird).with(Singing).get();
const bird = new SingingBird("Tweety");
```
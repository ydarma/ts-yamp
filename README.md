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
    return `I sing like a bird ${this.when}`;
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
Now, `SingingBird` has type `box & Bird & Singing` and references the same class as `box` declared inline in the `mixin` function call.

A constructor function may be passed to the `mixin`function to initialize the resulting class instances :
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
A method can be overriden, it won't be replace by mixin's method with the same name. The type of the mixins has to be annotated in the function signature :
```typescript
class Person {
  constructor(public name: string) {}
}

class APerson {
  constructor(name: string, when?: string) {
    Object.assign(this, new Singing(when), new Bird(name));
  }

  sing(this: Person & Singing) {
    return `I sing in the shower ${this.when}`;
  }
}
const PersonWhoSings = mixin(APerson).with(Person).with(Singing).get();

const person = new PersonWhoSings("Joe");
console.log(person.sing());
```
If needed the minxin orignal methods may be called from the target class. The construction of the class is simply broken down into two steps :
```typescript
const traits = mixin.with(Person).with(Singing);
class AnHonestPerson {
  constructor(name: string, when?: string) {
    Object.assign(this, new Singing(when), new Bird(name));
  }

  sing(this: Person & Singing) {
    const wrong = traits.prototype.sing.call(this);
    return `I would like to say that ${wrong} But I don't.`;
  }
}
const PersonWhoSings = mixin(AnHonestPerson).with(traits).get();

const man = new PersonWhoSings("Joe");
console.log(man.sing());
// I would like to say that I sing like a bird in the morning. But I don't.
```
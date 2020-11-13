import { mixin } from "./mixin";

class Singing {
  constructor(public when?: string) {}

  sing(): string {
    return `I sing like a bird ${this.when ?? "in the morning."}`;
  }
}

class Bird {
  constructor(public name: string) {}
}

class Person {
  constructor(public name: string) {}
}

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

const alice = new AliceSings();
console.log(alice.sing());
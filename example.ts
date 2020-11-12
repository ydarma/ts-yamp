import { mixin } from "./mixin";

class Singing {
  constructor(public when: string = "in the morning.") {}

  sing(): string {
    return `I sing like a bird ${this.when}`;
  }
}

class Bird {
  constructor(public name: string) {}
}

class ABird {
  constructor(name: string, when?: string) {
    Object.assign(this, new Singing(when), new Bird(name));
  }
}

class Person {
  constructor(public name: string) {}
}

function baseCtor(this: Person & Singing, name: string, when?: string) {
  Object.assign(this, new Singing(when), new Bird(name));
}
const Base = mixin(baseCtor).with(Person).with(Singing).get();

class AnHonestPerson {
  private readonly base: Person & Singing;

  constructor(name: string, when?: string) {
    this.base = new Base(name, when);
    Object.assign(this, this.base);
  }

  sing() {
    const wrong = this.base.sing();
    return `I would like to say that ${wrong} But I don't.`;
  }
}
const PersonWhoSings = mixin(AnHonestPerson).with(Base).get();
const man = new PersonWhoSings("Joe");
console.log(man.sing());

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
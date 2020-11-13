import test from "tape";
import { mixin } from "./mixin";
import { Bird, Man, Singing } from "./test-types";

test("Mixin class", (t) => {
  const SingingBird = mixin(class {})
    .with(Bird)
    .with(Singing)
    .get();

  const myBird = new SingingBird();
  t.equal(myBird.sing(), "I sing like a bird.");
  t.end();
});

test("Mixin class with constructor", (t) => {
  function singingBird(this: Bird & Singing, when: string) {
    this.name = "Tweety";
    this.when = when;
  }
  const SingingBird = mixin(singingBird).with(Bird).with(Singing).get();

  const myBird = new SingingBird("All the day.");
  t.equal(myBird.name, "Tweety");
  t.equal(myBird.sing(), "I sing like a bird.");
  t.equal(myBird.when, "All the day.");
  t.end();
});

test("Mixin class with override", (t) => {
  class Cuckoo {
    sing() {
      return "Each hour.";
    }
  }
  const SingingBird = mixin(Cuckoo).with(Bird).with(Singing).get();

  const myBird = new SingingBird();
  t.equal(myBird.sing(), "Each hour.");
  t.end();
});

test("Mixin class and instance", (t) => {
  const singingBird = function (
    this: Bird & Singing,
    name: string,
    when?: string
  ): void {
    Object.assign(this, new Singing(when), new Bird(name));
  };
  const SingingBird = mixin(singingBird).with(Bird).with(Singing).get();

  const myBird = new SingingBird("Tweety");
  t.equal(myBird.name, "Tweety");
  t.equal(myBird.sing(), "I sing like a bird.");
  t.equal(myBird.when, "In the morning.");
  t.end();
});

test("Mixin class and instance with override", (t) => {
  class Informer {
    constructor(name: string, when?: string) {
      Object.assign(this, new Singing(when), new Man(name));
    }

    sing() {
      return "I'll say everything.";
    }
  }
  const ManWhoSing = mixin(Informer).with(Man).with(Singing).get();

  const joe = new ManWhoSing("Joe", "Every day.");
  t.equal(joe.name, "Joe");
  t.equal(joe.sing(), "I'll say everything.");
  t.equal(joe.when, "Every day.");
  t.end();
});

test("Mixin class with override and super call", (t) => {
  const traits = mixin.with(Man).with(Singing);
  class Informer {
    private readonly singing: Singing;
    constructor(name: string, when?: string) {
      this.singing = new Singing(when);
      Object.assign(this, this.singing, new Man(name));
    }

    sing() {
      const s = traits.prototype.sing();
      return `I'll say everything. ${s}`;
    }
  }
  const ManWhoSing = mixin(Informer).with(traits).get();

  const joe = new ManWhoSing("Joe", "Every day.");
  t.equal(joe.sing(), "I'll say everything. I sing like a bird.");
  t.end();
});

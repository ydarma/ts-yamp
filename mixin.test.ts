import test from "tape";
import mixin, { mixed } from "./mixin";
import { Bird, Informer, Man, Singer } from "./test-types";

test("Mixin class", (t) => {
  const TestMixin = mixed();
  const BirdWhichSing = mixin(mixin(TestMixin, Bird), Singer);

  const myBird = new BirdWhichSing();
  t.equal(myBird.sing(), "I sing like a bird.");
  t.end();
});

test("Mixin class with constructor", (t) => {
  const TestMixin = mixed(function (when: string) {
    Object.assign(this, { name: "Titi", when: when });
  });
  const BirdWhichSing = mixin(mixin(TestMixin, Bird), Singer);

  const myBird = new BirdWhichSing("All the day.");
  t.equal(myBird.name, "Titi");
  t.equal(myBird.sing(), "I sing like a bird.");
  t.equal(myBird.when, "All the day.");
  t.end();
});

test("Mixin class with override", (t) => {
  const TestMixin = mixed();
  const ManWhoSing = mixin(mixin(mixin(TestMixin, Man), Informer), Singer);

  const joe = new ManWhoSing();
  t.equal(joe.sing(), "I say every thing.");
  t.end();
});

test("Mixin class and instance", (t) => {
  const TestMixin = mixed(function (name: string) {
    Object.assign(this, new Singer(), new Bird(name));
  });
  const BirdWhichSing = mixin(mixin(TestMixin, Bird), Singer);

  const myBird = new BirdWhichSing("Titi");
  t.equal(myBird.name, "Titi");
  t.equal(myBird.sing(), "I sing like a bird.");
  t.equal(myBird.when, "In the morning.");
  t.end();
});

test("Mixin class and instance with constructor", (t) => {
  const TestMixin = mixed(function (when: string) {
    Object.assign(this, new Singer(when), new Bird("Titi"));
  });
  const BirdWhichSing = mixin(mixin(TestMixin, Bird), Singer);

  const myBird = new BirdWhichSing("During the night.");
  t.equal(myBird.name, "Titi");
  t.equal(myBird.sing(), "I sing like a bird.");
  t.equal(myBird.when, "During the night.");
  t.end();
});

test("Mixin class and instance with override", (t) => {
  const TestMixin = mixed(function (name: string, when?: string) {
    Object.assign(this, new Singer(when), new Informer(), new Man(name));
  });
  const ManWhoSing = mixin(mixin(mixin(TestMixin, Man), Informer), Singer);

  const joe = new ManWhoSing("Joe", "Every day.");
  t.equal(joe.name, "Joe");
  t.equal(joe.sing(), "I say every thing.");
  t.equal(joe.when, "Every day.");
  t.end();
});

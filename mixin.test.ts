import test from "tape";
import mixin from "./mixin";
import { Bird, Informer, Man, Singer } from "./test-types";

test("Mixin class", (t) => {
  class TestMixin {}
  const BirdWhichSing = mixin(mixin(TestMixin, Bird), Singer);
  const myBird = new BirdWhichSing();
  t.equal(myBird.sing(), "I sing like a bird.");
  t.end();
});

test("Mixin class with constructor", (t) => {
  class TestMixin {}

  const birdConstructor = function (when: string) {
    this.name = "Titi";
    this.when = when;
  };
  const BirdWhichSing = mixin(mixin(TestMixin, Bird), Singer, birdConstructor);

  const myBird = new BirdWhichSing("All the day.");
  t.equal(myBird.name, "Titi");
  t.equal(myBird.sing(), "I sing like a bird.");
  t.equal(myBird.when, "All the day.");
  t.end();
});

test("Mixin class with override", (t) => {
  class TestMixin {}
  const ManWhoSing = mixin(mixin(mixin(TestMixin, Man), Informer), Singer);
  const joe = new ManWhoSing();
  t.equal(joe.sing(), "I say every thing.");
  t.end();
});

test("Mixin class and instance", (t) => {
  class TestMixin {}
  const BirdNamedTiti = mixin(TestMixin, Bird);

  const birdConstructor = function (name: string): void {
    Object.assign(this, new Singer(), new Bird(name));
  };
  const BirdWhichSing = mixin(BirdNamedTiti, Singer, birdConstructor);

  const myBird = new BirdWhichSing("Titi");
  t.equal(myBird.name, "Titi");
  t.equal(myBird.sing(), "I sing like a bird.");
  t.equal(myBird.when, "In the morning.");
  t.end();
});

test("Mixin class and instance with constructor", (t) => {
  class TestMixin {}

  const titiConstructor = function () {
    Object.assign(this, new Bird("Titi"));
  };
  const BirdNamedTiti = mixin(TestMixin, Bird, titiConstructor);

  const birdConstructor = function (when: string) {
    Object.assign(this, new Singer(when), new BirdNamedTiti());
  };
  const BirdWhichSing = mixin(BirdNamedTiti, Singer, birdConstructor);

  const myBird = new BirdWhichSing("During the night.");
  t.equal(myBird.name, "Titi");
  t.equal(myBird.sing(), "I sing like a bird.");
  t.equal(myBird.when, "During the night.");
  t.end();
});

test("Mixin class and instance with override", (t) => {
  class TestMixin {}
  const ManNamedJoe = mixin(TestMixin, Man);
  const ManWhoInform = mixin(ManNamedJoe, Informer);
  const manConstructor = function (name: string, when: string): void {
    Object.assign(this, new Singer(when), new Informer(), new Man(name));
  };
  const ManWhoSing = mixin(ManWhoInform, Singer, manConstructor);
  const joe = new ManWhoSing("Joe", "Every day.");
  t.equal(joe.name, "Joe");
  t.equal(joe.sing(), "I say every thing.");
  t.equal(joe.when, "Every day.");
  t.end();
});

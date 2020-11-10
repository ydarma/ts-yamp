import test from "tape";
import { mixin, constr } from "./mixin";
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
  const birdConstructor = function (this: Bird & Singer, when: string) {
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
  const BirdNamedTiti = mixin(TestMixin, Bird, constr(TestMixin, Bird, "Titi"));
  const BirdWhichSing = mixin(
    BirdNamedTiti,
    Singer,
    constr(BirdNamedTiti, Singer)
  );
  const myBird = new BirdWhichSing();
  t.equal(myBird.name, "Titi");
  t.equal(myBird.sing(), "I sing like a bird.");
  t.equal(myBird.when, "In the morning.");
  t.end();
});

test("Mixin class and instance with constructor", (t) => {
  class TestMixin {}
  const BirdNamedTiti = mixin(TestMixin, Bird, constr(TestMixin, Bird, "Titi"));
  const birdConstructor = function (this: Bird & Singer, when: string) {
    this.when = when;
  };
  const BirdWhichSing = mixin(
    BirdNamedTiti,
    Singer,
    constr(birdConstructor, constr(BirdNamedTiti, Singer))
  );
  const myBird = new BirdWhichSing("During the night.");
  t.equal(myBird.name, "Titi");
  t.equal(myBird.sing(), "I sing like a bird.");
  t.equal(myBird.when, "During the night.");
  t.end();
});

test("Mixin class and instance with override", (t) => {
  class TestMixin {}
  const ManNamedJoe = mixin(TestMixin, Man, constr(TestMixin, Man, "Joe"));
  const ManWhoInform = mixin(
    ManNamedJoe,
    Informer,
    constr(ManNamedJoe, Informer)
  );
  const ManWhoSing = mixin(
    ManWhoInform,
    Singer,
    constr(ManWhoInform, Singer, "Every day.")
  );
  const joe = new ManWhoSing();
  t.equal(joe.name, "Joe");
  t.equal(joe.sing(), "I say every thing.");
  t.equal(joe.when, "Every day.");
  t.end();
});

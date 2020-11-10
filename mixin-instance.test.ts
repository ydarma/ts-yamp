import test from "tape";
import { mixin, constr } from "./mixin-instance";
import { Bird, Informer, Man, Singer } from "./types";

test("Mixin class and instance", (t) => {
  const BirdWhichSing = mixin(mixin(class {}, Bird, "Titi"), Singer);
  const myBird = new BirdWhichSing();
  t.equal(myBird.name, "Titi");
  t.equal(myBird.sing(), "I sing like a bird.");
  t.equal(myBird.when, "In the morning.");
  t.end();
});

test("Mixin class and instance with constructor", (t) => {
  const birdConstructor = function (this: Bird & Singer, when: string) {
    this.when = when;
  };
  const BirdWhichSing = constr(birdConstructor, mixin(Bird, Singer), "Titi");
  const myBird = new BirdWhichSing("During the night.");
  t.equal(myBird.name, "Titi");
  t.equal(myBird.sing(), "I sing like a bird.");
  t.equal(myBird.when, "During the night.");
  t.end();
});

test("Mixin class and instance with override", (t) => {
  const ManWhoSing = mixin(
    mixin(mixin(class {}, Man, "Joe"), Informer),
    Singer,
    "Every day."
  );
  const joe = new ManWhoSing();
  t.equal(joe.name, "Joe");
  t.equal(joe.sing(), "I say every thing.");
  t.equal(joe.when, "Every day.");
  t.end();
});
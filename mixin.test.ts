import test from "tape";
import { mixin, constr } from "./mixin";
import { Bird, Informer, Man, Singer } from "./types";

test("Mixin class", (t) => {
  const BirdWhichSing = mixin(mixin(class {}, Bird), Singer);
  const myBird = new BirdWhichSing();
  t.equal(myBird.sing(), "I sing like a bird.");
  t.end();
});

test("Mixin class with constructor", (t) => {
  const birdConstructor = function (this: Bird & Singer, when: string) {
    this.name = "Titi";
    this.when = when;
  };
  const BirdWhichSing = constr(
    birdConstructor,
    mixin(mixin(class {}, Bird), Singer)
  );
  const myBird = new BirdWhichSing("All the day.");
  t.equal(myBird.name, "Titi");
  t.equal(myBird.sing(), "I sing like a bird.");
  t.equal(myBird.when, "All the day.");
  t.end();
});

test("Mixin class with override", (t) => {
  const ManWhoSing = mixin(mixin(mixin(class {}, Man), Informer), Singer);
  const joe = new ManWhoSing();
  t.equal(joe.sing(), "I say every thing.");
  t.end();
});

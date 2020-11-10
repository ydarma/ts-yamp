import test from "tape";
import { mixin, constr } from "./extend";
import { Bird, Informer, Man, Singer } from "./types";

test("Extend bird class", t => {
    const BirdWhichSing = mixin(mixin(class {}, Bird), Singer);
    const myBird = new BirdWhichSing();
    t.equal(myBird.sing(), "I sing like a bird.");
    t.end();
})

test("Extend bird class with constructor", t => {
    const BirdWhichSing = constr(
        function(this: Bird & Singer) {
            this.name = "Titi";
        }, mixin(mixin(class {}, Bird), Singer));
    const myBird = new BirdWhichSing();
    t.equal(myBird.name, "Titi");
    t.equal(myBird.sing(), "I sing like a bird.");
    t.end();
})

test("Extend bird class with override", t => {
    const ManWhoSing = mixin(mixin(mixin(class {}, Man), Informer), Singer);
    const joe = new ManWhoSing();
    t.equal(joe.sing(), "I say every thing.");
    t.end();
})
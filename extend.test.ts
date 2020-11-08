import test from "tape";
import { extend } from "./extend";
import { Bird, Informer, Man, Singer } from "./types";

test("Extend bird class", t => {
    const BirdWhichSing = extend(extend(function(){}, Bird), Singer);
    const myBird = new BirdWhichSing();
    t.equal(myBird.sing(), "I sing like a bird.");
    t.end();
})

test("Extend bird class with constructor", t => {
    const BirdWhichSing = extend(
        function(this: Bird) {
            this.name = "Titi";
        }, Singer);
    const myBird = new BirdWhichSing();
    t.equal(myBird.name, "Titi");
    t.equal(myBird.sing(), "I sing like a bird.");
    t.end();
})

test("Extend bird class with override", t => {
    const ManWhoSing = extend(extend(extend(function(){}, Man), Informer), Singer);
    const joe = new ManWhoSing();
    t.equal(joe.sing(), "I say every thing.");
    t.end();
})
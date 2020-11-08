import test from "tape";
import { mixin } from "./mixin";
import { Bird, Informer, Man, Singer } from "./types";

test("Extend bird class", t => {
    interface BirdWhichSing extends Bird, Singer {}
    const BirdWhichSing = mixin(Bird, Singer);
    const myBird = new BirdWhichSing("Titi");
    t.equal(myBird.name, "Titi");
    t.equal(myBird.sing(), "I sing like a bird.");
    t.equal(myBird.when, "In the morning.");
    t.end();
})

test("Extend bird class with constructor", t => {
    interface BirdWhichSing extends Bird, Singer {}
    
    const BirdWhichSing = mixin(mixin(
        function(this: BirdWhichSing, when: string) {
            this.when = when;
        }, 
        Bird, "Titi"), Singer);
    const myBird = new BirdWhichSing("During the night.");
    t.equal(myBird.name, "Titi");
    t.equal(myBird.sing(), "I sing like a bird.");
    t.equal(myBird.when, "During the night.");
    t.end();
})

test("Extend bird class with override", t => {
    interface ManWhoSing extends Man, Informer, Singer {}
    const ManWhoSing = mixin(mixin(Man, Informer), Singer, "Every day.");
    const joe = new ManWhoSing("Joe");
    t.equal(joe.name, "Joe");
    t.equal(joe.sing(), "I say every thing.");
    t.equal(joe.when, "Every day.");
    t.end();
})
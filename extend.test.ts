import test from "tape";
import { extend } from "./extend";
import { Bird, Informer, Man, Singer } from "./types";

test("Extend bird class", t => {
    interface BirdWhichSing extends Bird, Singer {}
    class BirdWhichSing {}
    extend(extend(BirdWhichSing, Bird), Singer);
    const myBird = new BirdWhichSing();
    t.equal(myBird.sing(), "I sing like a bird.");
    t.end();
})

test("Extend bird class with constructor", t => {
    interface BirdWhichSing extends Bird, Singer {}
    
    const BirdWhichSing = extend(extend(
        function(this: BirdWhichSing, name: string) {
            this.name = name;
        }, 
        Bird), Singer);
    const myBird = new BirdWhichSing("Titi");
    t.equal(myBird.name, "Titi");
    t.equal(myBird.sing(), "I sing like a bird.");
    t.end();
})

test("Extend bird class with override", t => {
    interface ManWhoSing extends Man, Informer, Singer {}
    class ManWhoSing {}
    extend(extend(extend(ManWhoSing, Man), Informer), Singer);
    const joe = new ManWhoSing();
    t.equal(joe.sing(), "I say every thing.");
    t.end();
})
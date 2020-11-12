import { mixin } from "./mixin";

class Singing {
  constructor(public when: string = "In the morning.") {}

  sing(): string {
    return "I sing like a bird.";
  }
}

class Bird {
  constructor(public name: string) {}
}

class ABird {
  constructor(name: string, when?: string) {
    Object.assign(this, new Singing(when), new Bird(name));
  }
}
const SingingBird = mixin(ABird).with(Bird).with(Singing).get();
const bird = new SingingBird("Tweety");
console.log(bird.when);

console.log(SingingBird == ABird);

export class Singing {
  constructor(public when: string = "In the morning.") {}

  sing(): string {
    return "I sing like a bird.";
  }
}

export class Bird {
  constructor(public name: string) {}
}

export class Man {
  constructor(public name: string) {}
}

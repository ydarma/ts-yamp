export class Singer {
    constructor(public when: string = "In the morning.") {
        
    }

    sing(): string {
        return "I sing like a bird."
    }
}

export class Bird {
    constructor(public name: string) { }
}

export class Informer {
    sing(): string {
        return "I say every thing."
    }
}

export class Man {
    constructor(public name: string) { }
}
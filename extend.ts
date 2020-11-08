export type Ctor<T, S extends unknown[]> = new(...args: S) => T
export type Ftor<T, S extends unknown[]> = Ctor<T, S> | ((this: T, ...args: S) => void)

export function extend<T extends U, S extends unknown[], U>(t: Ftor<T, S>, u: Ftor<U, unknown[]>): Ctor<T, S> {
    Object.getOwnPropertyNames(u.prototype)
        .forEach(m => {
            console.log(m);
            if(!(m in t.prototype)) {
                Object.defineProperty(t.prototype, m, Object.getOwnPropertyDescriptor(u.prototype, m))
            }
        });
    return t as Ctor<T, S>;
};
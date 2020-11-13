'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function mixWith(ctor, trait) {
    Object.getOwnPropertyNames(trait.prototype)
        .filter((m) => !(m in ctor.prototype))
        .forEach(copy);
    return ctor;
    function copy(prop) {
        Object.defineProperty(ctor.prototype, prop, Object.getOwnPropertyDescriptor(trait.prototype, prop));
    }
}
class MixinBuilderImpl {
    constructor(ctor) {
        this.ctor = ctor;
    }
    get() {
        return this.ctor;
    }
    get prototype() {
        return this.ctor.prototype;
    }
    with(x) {
        const trait = x instanceof MixinBuilderImpl ? x.get() : x;
        const ctor = mixWith(this.ctor, trait);
        const builder = new MixinBuilderImpl(ctor);
        return builder;
    }
}
function newMixin() {
    function m(ctor) {
        return new MixinBuilderImpl(ctor);
    }
    function mWith(ctor) {
        return m(class {
        }).with(ctor);
    }
    m.with = mWith;
    return m;
}
const mixin = newMixin();

exports.mixin = mixin;

import { GameEvent, EmptyEventArgs } from './Event.js';
export class Property {
    constructor(value) {
        this._valueChanged = new GameEvent(this);
        this._value = value;
    }
    get valueChanged() {
        return this._valueChanged.handlerSet;
    }
    get value() {
        return this._value;
    }
    set value(v) {
        this._value = v;
        this._valueChanged.dispatch(EmptyEventArgs.instance);
    }
    valueOf() {
        return +this._value;
    }
    toString() {
        return this._value.toString();
    }
}

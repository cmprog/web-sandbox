import { GameEvent, GameEventHandlerSet, EmptyEventArgs } from './Event.js';

export class Property<T = number> {

    private _value: T;

    constructor(value: T) {
        this._valueChanged = new GameEvent<Property<T>>(this);        
        this._value = value;
    }

    private _valueChanged: GameEvent<Property<T>>;
    get valueChanged(): GameEventHandlerSet<Property<T>> {
        return this._valueChanged.handlerSet;
    }

    get value(): T {
        return this._value;
    }

    set value(v: T) {
        this._value = v;
        this._valueChanged.dispatch(EmptyEventArgs.instance);
    }

    valueOf(): number {
        return +this._value;
    }

    toString(): string {
        return this._value.toString();
    }
}

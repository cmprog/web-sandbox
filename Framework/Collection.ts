import { GameEvent, GameEventHandlerSet, EmptyEventArgs } from "./Event.js";
import { Property } from "./Property.js";

class ArrayInterator<T> implements Iterator<T> {

    private _nextIndex = 0;

    constructor(private readonly _items: Array<T>) {

    }

    next(): IteratorResult<T> {

        if (this._nextIndex >= this._items.length) {
            return {
                value: undefined,
                done: true,
            }
        }

        const result = {
            value: this._items[this._nextIndex],
            done: false,
        }

        this._nextIndex++;
        return result;
    }

}

export enum CollectionChangedAction {
    Add,
    Remove,
}

export class CollectionChangedEventArgs<T> {

    constructor(
        public readonly action: CollectionChangedAction, 
        public readonly item: T, 
        public readonly index: number) {

    }

    static add<T>(item: T, index: number): CollectionChangedEventArgs<T> {
        return new CollectionChangedEventArgs(CollectionChangedAction.Add, item, index);
    }

    static remove<T>(item: T, index: number): CollectionChangedEventArgs<T> {
        return new CollectionChangedEventArgs(CollectionChangedAction.Remove, item, index);
    }
}

export class Collection<T> implements Iterable<T> {

    private readonly _items = new Array<T>();

    constructor() {
        const i = this._items[Symbol.iterator];
        
    }

    private readonly _changedEvent = new GameEvent<Collection<T>, CollectionChangedEventArgs<T>>(this);
    get changed(): GameEventHandlerSet<Collection<T>, CollectionChangedEventArgs<T>> {
        return this._changedEvent.handlerSet;
    }

    readonly count = new Property(0);

    get(index: number): T {
        return this._items[index];
    }

    add(item: T) {
        this._items.push(item);
        this.count.value = this._items.length;

        if (!this._changedEvent.isEmpty) {
            const index = this._items.length - 1;
            const args = CollectionChangedEventArgs.add(item, index);
            this._changedEvent.dispatch(args);
        }        
    }

    remove(item: T): boolean {
        const index = this._items.indexOf(item);
        if (index < 0) return false;
        this._items.splice(index, 1);
        this.count.value = this._items.length;

        if (!this._changedEvent.isEmpty) {
            const args = CollectionChangedEventArgs.remove(item, index);
            this._changedEvent.dispatch(args);
        }
        
        return true;
    }

    contains(item: T): boolean {
        const index = this._items.indexOf(item);
        return (index >= 0);
    }
    
    [Symbol.iterator](): Iterator<T> {
        return new ArrayInterator(this._items);
    }
}
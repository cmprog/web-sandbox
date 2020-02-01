import { GameEvent } from "./Event.js";
import { Property } from "./Property.js";
class ArrayInterator {
    constructor(_items) {
        this._items = _items;
        this._nextIndex = 0;
    }
    next() {
        if (this._nextIndex >= this._items.length) {
            return {
                value: undefined,
                done: true,
            };
        }
        const result = {
            value: this._items[this._nextIndex],
            done: false,
        };
        this._nextIndex++;
        return result;
    }
}
export var CollectionChangedAction;
(function (CollectionChangedAction) {
    CollectionChangedAction[CollectionChangedAction["Add"] = 0] = "Add";
    CollectionChangedAction[CollectionChangedAction["Remove"] = 1] = "Remove";
})(CollectionChangedAction || (CollectionChangedAction = {}));
export class CollectionChangedEventArgs {
    constructor(action, item, index) {
        this.action = action;
        this.item = item;
        this.index = index;
    }
    static add(item, index) {
        return new CollectionChangedEventArgs(CollectionChangedAction.Add, item, index);
    }
    static remove(item, index) {
        return new CollectionChangedEventArgs(CollectionChangedAction.Remove, item, index);
    }
}
export class Collection {
    constructor() {
        this._items = new Array();
        this._changedEvent = new GameEvent(this);
        this.count = new Property(0);
        const i = this._items[Symbol.iterator];
    }
    get changed() {
        return this._changedEvent.handlerSet;
    }
    get(index) {
        return this._items[index];
    }
    add(item) {
        this._items.push(item);
        this.count.value = this._items.length;
        if (!this._changedEvent.isEmpty) {
            const index = this._items.length - 1;
            const args = CollectionChangedEventArgs.add(item, index);
            this._changedEvent.dispatch(args);
        }
    }
    remove(item) {
        const index = this._items.indexOf(item);
        if (index < 0)
            return false;
        this._items.splice(index, 1);
        this.count.value = this._items.length;
        if (!this._changedEvent.isEmpty) {
            const args = CollectionChangedEventArgs.remove(item, index);
            this._changedEvent.dispatch(args);
        }
        return true;
    }
    contains(item) {
        const index = this._items.indexOf(item);
        return (index >= 0);
    }
    [Symbol.iterator]() {
        return new ArrayInterator(this._items);
    }
}

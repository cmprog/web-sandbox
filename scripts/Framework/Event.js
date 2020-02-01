export class EmptyEventArgs {
    static instance() {
        return EmptyEventArgs._instance;
    }
}
EmptyEventArgs._instance = new EmptyEventArgs();
export class GameEvent {
    constructor(_source) {
        this._source = _source;
        this._handlers = [];
        this._handlerSet = new GameEventHandlerSet(this._handlers);
    }
    get isEmpty() {
        return this._handlerSet.count == 0;
    }
    get handlerSet() {
        return this._handlerSet;
    }
    dispatch(args) {
        for (const handler of this._handlers) {
            handler(this._source, args);
        }
    }
}
export class GameEventHandlerSet {
    constructor(_handlers) {
        this._handlers = _handlers;
    }
    get count() {
        return this._handlers.length;
    }
    add(handler) {
        this._handlers.push(handler);
    }
    remove(handler) {
        const index = this._handlers.indexOf(handler);
        if (index < 0)
            return false;
        this._handlers.splice(index, 1);
        return true;
    }
}

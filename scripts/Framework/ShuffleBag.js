export class ShuffleBag {
    constructor() {
        this._items = new Array();
        this._nextIndex = 0;
    }
    push(item) {
        this._items.push(item);
        this._nextIndex = this._items.length;
    }
    next() {
        if (this._items.length == 0) {
            throw "Empty bag.";
        }
        if (this._nextIndex >= this._items.length) {
            this._shuffle();
            this._nextIndex = 0;
        }
        const item = this._items[this._nextIndex];
        this._nextIndex += 1;
        return item;
    }
    _shuffle() {
        for (let i = this._items.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            const t = this._items[i];
            this._items[i] = this._items[j];
            this._items[j] = t;
        }
    }
}

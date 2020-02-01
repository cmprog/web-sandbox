export interface GameEventHandler<TSource, TArgs = EmptyEventArgs> {
    (sender: TSource, args: TArgs): void;
}

export class EmptyEventArgs {

    private static readonly _instance = new EmptyEventArgs();
    static instance(): EmptyEventArgs {
        return EmptyEventArgs._instance;
    }
}

export class GameEvent<TSource, TArgs = EmptyEventArgs> {

    private readonly _handlerSet: GameEventHandlerSet<TSource, TArgs>;
    private readonly _handlers: Array<GameEventHandler<TSource, TArgs>> = [];

    constructor(private _source: TSource) {
        this._handlerSet = new GameEventHandlerSet<TSource, TArgs>(this._handlers);
    }

    get isEmpty(): boolean {
        return this._handlerSet.count == 0;
    }

    get handlerSet(): GameEventHandlerSet<TSource, TArgs> {
        return this._handlerSet;
    }

    dispatch(args: TArgs) {
        for (const handler of this._handlers) {
            handler(this._source, args);
        }
    }
}

export class GameEventHandlerSet<TSource, TArgs = EmptyEventArgs> {

    constructor(private readonly _handlers: Array<GameEventHandler<TSource, TArgs>>) {

    }

    get count(): number {
        return this._handlers.length;
    }

    add(handler: GameEventHandler<TSource, TArgs>) {
        this._handlers.push(handler);
    }

    remove(handler: GameEventHandler<TSource, TArgs>): boolean {
        const index = this._handlers.indexOf(handler);
        if (index < 0) return false;
        this._handlers.splice(index, 1);
        return true;
    }
}

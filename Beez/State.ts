import { Property } from '../Framework/Property.js';
import { GameTime } from '../Framework/GameTime.js';
import { Hive } from './Hive.js';
import { HoneyHouse, Extractor, BottlingTank } from './HoneyHouse.js';
import { Collection } from '../Framework/Collection.js';
import { Action } from './Actions.js';
import { Game } from '../Framework/Game.js';
import { GameEventHandler } from '../Framework/Event.js';
import { BeeKeeper } from './BeeKeeper.js';

export class State {

    private _actionCompleteHandler: GameEventHandler<Action>;
    private _actionCancelledHandler: GameEventHandler<Action>;

    constructor(private readonly _game: Game) {

        if (State._current) {
            console.warn('Duplicate game state created.');
        } else {
            State._current = this;
        }

        this.time = this._game.time;
        this._actionCompleteHandler = this._onActionComplete.bind(this);
        this._actionCancelledHandler = this._onActionCancelled.bind(this);
    }
    
    readonly time: GameTime;
    readonly honeyHouse = new HoneyHouse();
    readonly beeKeeper = new BeeKeeper();
    readonly extractor = new Extractor();
    readonly bottlingTank = new BottlingTank();
    readonly actions = new Collection<Action>();

    hive = new Hive();
    
    money = new Property(1);
    interest = new Property(0.02);
    price = new Property(1.05);
    price2 = new Property(1.05);
    delay = new Property(10);
    delayMax = new Property(10);
    minus = new Property(1);
    moneyPlus = new Property(0.01);
    jobPoints = new Property(1);
    jobMax = new Property(50);
    jobPrice = new Property(50);
    jobPlus = new Property(1);

    enqueueAction(action: Action) {
        
        action.cancelled.add(this._actionCancelledHandler);
        this.actions.add(action);

        if (this.actions.count.value === 1) {
            this._startNextAction();
        }
    }

    private _startNextAction() {
        if (this.actions.count.value === 0) return;
        const action = this.actions.get(0);
        action.completed.add(this._actionCompleteHandler);
        action.start();
        this._game.register(action);
    }

    private _removeAction(action: Action) {
        
        this.actions.remove(action);

        action.completed.remove(this._actionCompleteHandler);
        action.cancelled.remove(this._actionCancelledHandler);

        this._game.unregister(action);
    }

    private _onActionCancelled(action: Action) {
        this._removeAction(action);
    }

    private _onActionComplete(action: Action) {
        this._removeAction(action);
        this._startNextAction();        
    }

    applyInterest() {
        const earnedInterest = this.money.value * this.interest.value;
        this.money.value += earnedInterest;
    }

    public doJob() {
        this.jobPoints.value += this.jobPlus.value;
        this.money.value += this.moneyPlus.value;
        while (this.jobPoints.value >= this.jobMax.value) {
            this.moneyPlus.value *= 1.7;
            this.jobPoints.value -= this.jobMax.value;
            this.jobMax.value *= 3;
        }
    }

    public buyUpgrade1() {
        if (this.money.value >= this.price.value) {
            this.interest.value += 0.01;
            this.money.value -= this.price.value;
            this.price.value *= 1.5;
        }
    }

    public buyUpgrade2() {
        if (this.money >= this.price2) {
            this.minus.value += 1;
            this.money.value -= this.price2.value;
            this.price2.value *= 5.4;
        }
    }

    public buyUpgrade3() {
        if (this.jobPoints >= this.jobPrice) {
            this.jobPlus.value += 1;
            this.jobPoints.value -= this.jobPrice.value;
            this.jobPrice.value *= 4;
        }
    }

    private static _current: State;
    static get current(): State {
        return State._current;
    }
}

import { Property } from '../Framework/Property.js';
import { Hive } from './Hive.js';
import { HoneyHouse, Extractor, BottlingTank } from './HoneyHouse.js';
import { Collection } from '../Framework/Collection.js';
import { BeeKeeper } from './BeeKeeper.js';
export class State {
    constructor(_game) {
        this._game = _game;
        this.honeyHouse = new HoneyHouse();
        this.beeKeeper = new BeeKeeper();
        this.extractor = new Extractor();
        this.bottlingTank = new BottlingTank();
        this.actions = new Collection();
        this.hive = new Hive();
        this.money = new Property(1);
        this.interest = new Property(0.02);
        this.price = new Property(1.05);
        this.price2 = new Property(1.05);
        this.delay = new Property(10);
        this.delayMax = new Property(10);
        this.minus = new Property(1);
        this.moneyPlus = new Property(0.01);
        this.jobPoints = new Property(1);
        this.jobMax = new Property(50);
        this.jobPrice = new Property(50);
        this.jobPlus = new Property(1);
        if (State._current) {
            console.warn('Duplicate game state created.');
        }
        else {
            State._current = this;
        }
        this.time = this._game.time;
        this._actionCompleteHandler = this._onActionComplete.bind(this);
        this._actionCancelledHandler = this._onActionCancelled.bind(this);
    }
    enqueueAction(action) {
        action.cancelled.add(this._actionCancelledHandler);
        this.actions.add(action);
        if (this.actions.count.value === 1) {
            this._startNextAction();
        }
    }
    _startNextAction() {
        if (this.actions.count.value === 0)
            return;
        const action = this.actions.get(0);
        action.completed.add(this._actionCompleteHandler);
        action.start();
        this._game.register(action);
    }
    _removeAction(action) {
        this.actions.remove(action);
        action.completed.remove(this._actionCompleteHandler);
        action.cancelled.remove(this._actionCancelledHandler);
        this._game.unregister(action);
    }
    _onActionCancelled(action) {
        this._removeAction(action);
    }
    _onActionComplete(action) {
        this._removeAction(action);
        this._startNextAction();
    }
    applyInterest() {
        const earnedInterest = this.money.value * this.interest.value;
        this.money.value += earnedInterest;
    }
    doJob() {
        this.jobPoints.value += this.jobPlus.value;
        this.money.value += this.moneyPlus.value;
        while (this.jobPoints.value >= this.jobMax.value) {
            this.moneyPlus.value *= 1.7;
            this.jobPoints.value -= this.jobMax.value;
            this.jobMax.value *= 3;
        }
    }
    buyUpgrade1() {
        if (this.money.value >= this.price.value) {
            this.interest.value += 0.01;
            this.money.value -= this.price.value;
            this.price.value *= 1.5;
        }
    }
    buyUpgrade2() {
        if (this.money >= this.price2) {
            this.minus.value += 1;
            this.money.value -= this.price2.value;
            this.price2.value *= 5.4;
        }
    }
    buyUpgrade3() {
        if (this.jobPoints >= this.jobPrice) {
            this.jobPlus.value += 1;
            this.jobPoints.value -= this.jobPrice.value;
            this.jobPrice.value *= 4;
        }
    }
    static get current() {
        return State._current;
    }
}

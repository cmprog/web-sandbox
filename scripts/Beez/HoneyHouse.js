import { Property } from "../Framework/Property.js";
import { Collection } from "../Framework/Collection.js";
import { TimedAction } from "./Actions.js";
import { State } from "./State.js";
export class Extractor {
    constructor() {
        this.superCapacity = new Property(1);
        this.supers = new Collection();
        this.extractionDuration = new Property(1);
    }
    attachTemplateBindings(context) {
        context.bindCommand('.extract', this._onExtract.bind(this));
    }
    _onExtract() {
        State.current.enqueueAction(new ExtractionAction(this));
    }
}
export class BottlingTank {
    constructor() {
        this.honeyCapacity = new Property(10);
        this.honeyAmount = new Property(0);
        this.fillSpeed = new Property(1);
    }
    attachTemplateBindings(context) {
        context.bindCommand('.fill', this._onFill.bind(this));
    }
    _onFill() {
        State.current.enqueueAction(new TankFillAction(this));
    }
}
export class HoneyHouse {
    constructor() {
        this.superCapacity = new Property(3);
        this.supers = new Collection();
        this.containerCapacity = new Property(10);
        this.emptyContainers = new Collection();
        this.filledContainers = new Collection();
    }
    attachTemplateBindings(context) {
    }
}
class TankFillAction extends TimedAction {
    constructor(_tank) {
        super();
        this._tank = _tank;
    }
    _getDuraction() {
        if (!this._tank.container)
            return null;
        if (this._tank.honeyAmount.value < this._tank.container.capacity.value)
            return null;
        return this._tank.container.capacity.value / this._tank.fillSpeed.value;
    }
    _execute() {
        const state = State.current;
        state.honeyHouse.filledContainers.add(this._tank.container);
        this._tank.honeyAmount.value -= this._tank.container.capacity.value;
        this._tank.container = null;
    }
}
class ExtractionAction extends TimedAction {
    constructor(_extractor) {
        super();
        this._extractor = _extractor;
    }
    _getDuraction() {
        if (!this._extractor.supers.count)
            return null;
        const tank = State.current.bottlingTank;
        let honey = tank.honeyAmount.value;
        for (const hiveSuper of this._extractor.supers) {
            honey += hiveSuper.honey.value;
            if (honey >= tank.honeyCapacity.value)
                return null;
        }
        return this._extractor.extractionDuration.value;
    }
    _execute() {
        const tank = State.current.bottlingTank;
        let extractedHoney = 0;
        for (const hiveSuper of this._extractor.supers) {
            extractedHoney += hiveSuper.honey.value;
            hiveSuper.honey.value = 0;
        }
        tank.honeyAmount.value += extractedHoney;
    }
}

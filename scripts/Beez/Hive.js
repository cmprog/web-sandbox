import { Property } from '../Framework/Property.js';
import { TickCountdownGenerator } from '../Framework/Generators.js';
import { Collection } from '../Framework/Collection.js';
import { Formatters } from '../Framework/Formatters.js';
import { State } from './State.js';
import { TimedAction } from './Actions.js';
export class HiveSuper {
    constructor() {
        this.pollen = new Property(0);
        this.honey = new Property(0);
        this.pollenCapacity = new Property(10);
        this.isInactive = new Property(false);
    }
    attachTemplateBindings(context) {
        context.propertyBinding('.pollen .value', this.pollen, Formatters.Fixed_0);
        context.propertyBinding('.honey .value', this.honey, Formatters.Fixed_0);
        context.propertyBinding('.resource-capacity .value', this.pollenCapacity, Formatters.Fixed_0);
        const dualProgress = context.dualProgressBar('.dual-progress', this.pollen, this.honey, this.pollenCapacity);
        if (dualProgress) {
            dualProgress.defaultTitle = 'Remaining capacity';
            dualProgress.primaryTitle = 'Amount of pollen collected.';
            dualProgress.secondaryTitle = 'Amount of pollen converted to honey.';
        }
        context.bindCommand('.collect', this._onCollect.bind(this));
        context.bindCommand('.load', this._onLoadExtractor.bind(this));
        context.bindCommand('.store', this._onStore.bind(this));
        context.classBinding(null, this.isInactive, 'inactive');
    }
    _findHive(state) {
        if (state.hive.supers.contains(this)) {
            return state.hive;
        }
        return null;
    }
    _onCollect() {
        const state = State.current;
        const hive = this._findHive(state);
        if (!hive)
            return;
        state.enqueueAction(new HiveSuperTransportAction(this, hive.supers, state.beeKeeper.supers, state.beeKeeper.superCapacity, state.beeKeeper.collectionSpeed));
    }
    _onStore() {
        const state = State.current;
        state.enqueueAction(new HiveSuperTransportAction(this, state.beeKeeper.supers, state.honeyHouse.supers, state.honeyHouse.superCapacity, state.beeKeeper.storeSuperSpeed));
    }
    _onLoadExtractor() {
        const state = State.current;
        // This super may be on the bee keeper or the honey house storage.
        let sourceCollection = null;
        if (state.honeyHouse.supers.contains(this)) {
            sourceCollection = state.honeyHouse.supers;
        }
        if (state.beeKeeper.supers.contains(this)) {
            sourceCollection = state.beeKeeper.supers;
        }
        state.enqueueAction(new HiveSuperTransportAction(this, sourceCollection, state.extractor.supers, state.extractor.superCapacity, state.beeKeeper.extractorLoadingSpeed));
    }
}
class HiveSuperTransportAction extends TimedAction {
    constructor(_hiveSuper, _sourceCollection, _targetCollection, _targetCapacity, _duration) {
        super();
        this._hiveSuper = _hiveSuper;
        this._sourceCollection = _sourceCollection;
        this._targetCollection = _targetCollection;
        this._targetCapacity = _targetCapacity;
        this._duration = _duration;
    }
    _getDuraction() {
        if (this._targetCollection.count.value >= this._targetCapacity.value) {
            return null;
        }
        // Make sure the super is still part of the source collection
        if (this._sourceCollection.contains(this._hiveSuper)) {
            this._hiveSuper.isInactive.value = true;
            return this._duration.value;
        }
        return null;
    }
    _execute() {
        if (this._sourceCollection.remove(this._hiveSuper)) {
            this._hiveSuper.isInactive.value = false;
            this._targetCollection.add(this._hiveSuper);
        }
    }
}
export class Hive {
    constructor() {
        this.supers = new Collection();
        this.superCount = new Property(0);
        this.superCapacity = new Property(0);
        this.workerCount = new Property(1);
        this.workerRate = new Property(0.1);
        this.foragerCount = new Property(1);
        this.forageAmount = new Property(1);
        this.forageSpeed = new Property(1);
        this.forageRemainingDistance = new Property(2);
        this.forageDistance = new Property(2);
        this.beeCapacity = new Property(3);
        this.supers.add(new HiveSuper());
    }
    createForagerGenerator() {
        return new TickCountdownGenerator(this.forageRemainingDistance, this.forageDistance, this._collectPollen.bind(this));
    }
    addSuper() {
        this.supers.add(new HiveSuper());
    }
    _collectPollen() {
        let pollenCollected = this.foragerCount.value * this.forageAmount.value;
        for (const hiveSuper of this.supers) {
            if (hiveSuper.isInactive.value)
                continue;
            if (pollenCollected <= 0)
                break;
            const remainingCapacity = hiveSuper.pollenCapacity.value - (hiveSuper.pollen.value + hiveSuper.honey.value);
            const pollenDelta = Math.min(remainingCapacity, pollenCollected);
            hiveSuper.pollen.value += pollenDelta;
            pollenCollected -= pollenDelta;
        }
    }
    _processPollen() {
        let generatedHoney = this.workerCount.value * this.workerRate.value;
        for (const hiveSuper of this.supers) {
            if (hiveSuper.isInactive.value)
                continue;
            if (generatedHoney <= 0)
                break;
            const honeyDelta = Math.min(hiveSuper.pollen.value, generatedHoney);
            hiveSuper.honey.value += honeyDelta;
            hiveSuper.pollen.value -= honeyDelta;
            generatedHoney -= honeyDelta;
        }
    }
    fixedUpdate() {
        this._processPollen();
    }
}

import { Property } from "../Framework/Property.js";
import { Collection } from "../Framework/Collection.js";
import { HiveSuper } from "./Hive.js";
import { TimedAction } from "./Actions.js";
import { State } from "./State.js";
import { TemplateComponent, TemplateContext } from "../Framework/Bindings.js";
import { Container } from "./Containers.js";

export class Extractor implements TemplateComponent {
        
    readonly superCapacity = new Property(1);
    readonly supers = new Collection<HiveSuper>();

    readonly extractionDuration = new Property(1);

    attachTemplateBindings(context: TemplateContext) {
        
        context.bindCommand('.extract', this._onExtract.bind(this));
    }

    private _onExtract(): void {
        State.current.enqueueAction(new ExtractionAction(this));
    }
}

export class BottlingTank implements TemplateComponent {
    
    readonly honeyCapacity = new Property(10);
    readonly honeyAmount = new Property(0);

    readonly fillSpeed = new Property(1);

    /**
     * The container loaded in the tank to fill
     */
    container: Container;

    attachTemplateBindings(context: TemplateContext) {
        context.bindCommand('.fill', this._onFill.bind(this));
    }

    private _onFill() {
        State.current.enqueueAction(new TankFillAction(this));
    }
}

export class HoneyHouse implements TemplateComponent {

    readonly superCapacity = new Property(3);
    readonly supers = new Collection<HiveSuper>();

    readonly containerCapacity = new Property(10);
    
    readonly emptyContainers = new Collection<Container>();
    readonly filledContainers = new Collection<Container>();

    attachTemplateBindings(context: TemplateContext) {
        
    }
}

class TankFillAction extends TimedAction {
    
    constructor(private readonly _tank: BottlingTank) {
        super()
    }

    protected _getDuraction(): number {
        if (!this._tank.container) return null;
        if (this._tank.honeyAmount.value < this._tank.container.capacity.value) return null;
        return this._tank.container.capacity.value / this._tank.fillSpeed.value;
    }

    protected _execute(): void {        
        const state = State.current;
        state.honeyHouse.filledContainers.add(this._tank.container);
        this._tank.honeyAmount.value -= this._tank.container.capacity.value;
        this._tank.container = null;
    }
}

class ExtractionAction extends TimedAction {
    
    constructor(private readonly _extractor: Extractor) {
        super();


    }

    protected _getDuraction(): number {
        if (!this._extractor.supers.count) return null;

        const tank = State.current.bottlingTank;

        let honey = tank.honeyAmount.value;
        for (const hiveSuper of this._extractor.supers) {
            honey += hiveSuper.honey.value;
            if (honey >= tank.honeyCapacity.value) return null;
        }

        return this._extractor.extractionDuration.value;
    }
    
    protected _execute(): void {
        const tank = State.current.bottlingTank;

        let extractedHoney = 0;
        for (const hiveSuper of this._extractor.supers) {
            extractedHoney += hiveSuper.honey.value;
            hiveSuper.honey.value = 0;
        }

        tank.honeyAmount.value += extractedHoney;
    }
}
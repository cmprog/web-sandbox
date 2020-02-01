import { Property } from "../Framework/Property";
import { TemplateComponent, TemplateContext } from "../Framework/Bindings";
import { TimedAction } from "./Actions";
import { State } from "./State";

export class Container implements TemplateComponent {
    
    private constructor(initialCapacity: number) {
        this.capacity = new Property(initialCapacity);
    }

    readonly capacity: Property;

    attachTemplateBindings(context: TemplateContext) {

    }

    private _onLoad(): void {
    }

    static createBear(): Container {
        return new Container(12);
    }

    static createPint(): Container {
        return new Container(22);
    }

    static createQuart(): Container {
        return new Container(44);
    }
}

class ContainerLoadAction extends TimedAction {
    
    constructor(private readonly _container: Container) {
        super();
    }

    protected _getDuraction(): number {

        const state = State.current;        
        if (state.honeyHouse.emptyContainers.contains(this._container)) {
            return 1;
        }

        return null;
    }
    
    protected _execute(): void {
        
        const state = State.current;
        const tank = state.bottlingTank;
        const house = state.honeyHouse;

        if (house.emptyContainers.remove(this._container)) {
            if (tank.container) {
                // Move the container back to storage
                house.emptyContainers.add(tank.container);
            }

            tank.container = this._container;
        }
    }
}
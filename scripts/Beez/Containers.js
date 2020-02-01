import { Property } from "../Framework/Property";
import { TimedAction } from "./Actions";
import { State } from "./State";
export class Container {
    constructor(initialCapacity) {
        this.capacity = new Property(initialCapacity);
    }
    attachTemplateBindings(context) {
    }
    _onLoad() {
    }
    static createBear() {
        return new Container(12);
    }
    static createPint() {
        return new Container(22);
    }
    static createQuart() {
        return new Container(44);
    }
}
class ContainerLoadAction extends TimedAction {
    constructor(_container) {
        super();
        this._container = _container;
    }
    _getDuraction() {
        const state = State.current;
        if (state.honeyHouse.emptyContainers.contains(this._container)) {
            return 1;
        }
        return null;
    }
    _execute() {
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

import { Vector2 } from "../Drawing/Vector.js";
import { Component } from "./Component.js";
export class RigidBody extends Component {
    constructor(velocity) {
        super();
        this.velocity = velocity;
    }
}
export class BoxCollider extends Component {
    constructor() {
        super(...arguments);
        this.size = new Vector2(1, 1);
    }
}
export class Entity {
    constructor(tag) {
        this.tag = tag;
        this._components = new Array();
        this.position = new Vector2(0, 0);
        this.size = new Vector2(1, 1);
    }
    sendMessage(name, arg0 = null) {
        const args = [arg0];
        for (let i = 0; i < this._components.length; i++) {
            const component = this._components[i];
            const messageFunction = component[name];
            if (messageFunction) {
                messageFunction.apply(component, args);
            }
        }
    }
    getComponent(type) {
        return this._components.find(component => {
            return (component.constructor == type);
        });
    }
    addComponent(type, arg0 = null) {
        const component = new type(arg0);
        component.entity = this;
        this._components.push(component);
        return component;
    }
}

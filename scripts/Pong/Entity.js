import { Vector2 } from "../Drawing/Vector.js";
import { Component } from "./Component.js";
import { PhysicsGame } from "./PhysicsGame.js";
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
    constructor(...tags) {
        this._components = new Array();
        this.tags = new Set();
        this.position = new Vector2(0, 0);
        this.size = new Vector2(1, 1);
        for (const tag of tags) {
            this.tags.add(tag);
        }
    }
    sendMessage(name, arg0 = null, arg1 = null, arg2 = null) {
        const args = [arg0, arg1, arg2];
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
    addComponent(type, arg0 = null, arg1 = null, arg2 = null) {
        const component = new type(arg0, arg1, arg2);
        component.entity = this;
        this._components.push(component);
        return component;
    }
    static find(tag) {
        return PhysicsGame.instance.findEntityByTag(tag);
    }
}

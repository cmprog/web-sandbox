import { Vector2 } from "../Drawing/Vector.js";
import { Renderer } from "./Renderer.js";
import { Component } from "./Component.js";

export class RigidBody extends Component {

    constructor(public velocity: Vector2) {
        super()
    }
}


export class BoxCollider extends Component {

    size = new Vector2(1, 1);
}

export interface ComponentFactory<TComponent extends Component, TArg0>
{
    new (arg0?: TArg0): TComponent;
}

export class Entity {

    private readonly _components = new Array<Component>();

    constructor(public tag: string) {

    }

    position: Vector2 = new Vector2(0, 0);
    size: Vector2 = new Vector2(1, 1);

    sendMessage(name: string, arg0: any = null): void {
        const args = [arg0];
        for (let i = 0; i < this._components.length; i++) {
            const component = <any> this._components[i];
            const messageFunction = component[name];
            if (messageFunction) {                
                messageFunction.apply(component, args);
            }
        }
    }

    getComponent<TComponent extends Component, TArg0>(
        type: ComponentFactory<TComponent, TArg0>): TComponent {
        return <TComponent> this._components.find(component => {
            return (component.constructor == type);
        });
    }

    addComponent<TComponent extends Component, TArg0>(
        type: ComponentFactory<TComponent, TArg0>,
        arg0: TArg0 = null): TComponent {
        const component = new type(arg0);
        component.entity = this;
        this._components.push(component);
        return component;
    }
}
import { Vector2 } from "../Drawing/Vector.js";
import { Component } from "./Component.js";
import { PhysicsGame } from "./PhysicsGame.js";

export class RigidBody extends Component {

    constructor(public velocity: Vector2) {
        super()
    }
}

export class BoxCollider extends Component {
    size = new Vector2(1, 1);
}

export interface ComponentFactory<TComponent extends Component, TArg0, TArg1, TArg2>
{
    new (arg0?: TArg0, arg1?: TArg1, arg2?: TArg2): TComponent;
}

export class Entity {

    private readonly _components = new Array<Component>();

    constructor(... tags: string[]) {
        for (const tag of tags) {
            this.tags.add(tag);
        }
    }

    readonly tags = new Set<string>();

    position: Vector2 = new Vector2(0, 0);
    size: Vector2 = new Vector2(1, 1);

    sendMessage(name: string, arg0: any = null, arg1: any = null, arg2: any = null): void {
        const args = [arg0, arg1, arg2];
        for (let i = 0; i < this._components.length; i++) {
            const component = <any> this._components[i];
            const messageFunction = component[name];
            if (messageFunction) {                
                messageFunction.apply(component, args);
            }
        }
    }

    getComponent<TComponent extends Component, TArg0, TArg1, TArg2>(
        type: ComponentFactory<TComponent, TArg0, TArg1, TArg2>): TComponent {
        return <TComponent> this._components.find(component => {
            return (component.constructor == type);
        });
    }

    addComponent<TComponent extends Component, TArg0, TArg1, TArg2>(
        type: ComponentFactory<TComponent, TArg0, TArg1, TArg2>,
        arg0: TArg0 = null, arg1: TArg1 = null, arg2: TArg2 = null): TComponent {
        const component = new type(arg0, arg1, arg2);
        component.entity = this;
        this._components.push(component);
        return component;
    }

    static find(tag: string): Entity {
        return PhysicsGame.instance.findEntityByTag(tag);
    }
}
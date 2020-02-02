import { Entity } from "./Entity.js";

export class Component {

    private _entity: Entity;
    get entity(): Entity {
        return this._entity;
    }

    set entity(v: Entity) {
        if (this._entity) {
            console.warn('Component entity should generally not change once set.');
        }
        this._entity = v;
    }

    get tags(): Set<string> {
        return this.entity.tags;
    }
}
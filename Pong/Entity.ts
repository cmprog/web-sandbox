import { Vector2 } from "../Drawing/Vector.js";
import { Behavior } from "./Behavior.js";
import { Renderer } from "./Renderer.js";

export class RigidBody {
    velocity: Vector2;
}

export class BoxCollider {

    constructor(public readonly entity: Entity) {

    }

    size= new Vector2(1, 1);
}

export class Entity {
    position: Vector2;
    size: Vector2;
    renderer: Renderer;
    behavior: Behavior;
    rigidBody: RigidBody;
    collider: BoxCollider;
}
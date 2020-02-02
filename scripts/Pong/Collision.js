import { RigidBody } from "./Entity.js";
export class Collision {
    constructor(collider) {
        this.collider = collider;
        this.rigidBody = collider.entity.getComponent(RigidBody);
    }
}

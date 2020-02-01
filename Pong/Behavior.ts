import { Entity, BoxCollider } from "./Entity.js";
import { Vector2 } from "../Drawing/Vector.js";

export interface Behavior {
    update(): void;
}

export class BallMovementBehavior implements Behavior {

    constructor(private readonly _entity: Entity, private readonly _bounds: Vector2) {

    }

    speed: number = 5;

    update(): void {        

        const body = this._entity.rigidBody;
        if (!body) return;

        const halfBoundHeight = this._bounds.y / 2;

        // Top bounds
        if (this._entity.position.y > halfBoundHeight ) {
            this._entity.position.y = halfBoundHeight;
            body.velocity.y = -1;
        }

        // Bottom bounds
        if (this._entity.position.y < -halfBoundHeight) {
            this._entity.position.y = -halfBoundHeight;
            body.velocity.y = 1;
        }

        body.velocity.normalize();
        body.velocity.scale(this.speed);
    }

    reflectVertical(): void {
        const body = this._entity.rigidBody;
        if (!body) return;
        body.velocity.x = -body.velocity.x;
    }
}

export class EnemyPaddleBahavior implements Behavior {

    constructor(public readonly entity: Entity) {
        
    }

    ball: Entity;
    
    update(): void {
        if (!this.ball) return;
        // perfect AI
        this.entity.position.y = this.ball.position.y;
    }

    onTriggerEnter(other: BoxCollider) {
        const body = other.entity.rigidBody;
        if (!body) return;        
        const v = body.velocity;
        if (v.x < 0) {
            v.x = -v.x;
        }
    }
}

export class PlayerPaddleBehavior implements Behavior {

    constructor(private readonly _entity: Entity, private readonly _cursorPos: Vector2) {

    }

    speed: number = 5;

    update(): void {
        if (this._cursorPos.y < this._entity.position.y) {
            this._entity.position.y -= this.speed;
        } else if (this._cursorPos.y > this._entity.position.y) {
            this._entity.position.y += this.speed;
        }
    }

    onTriggerEnter(other: BoxCollider) {
        const body = other.entity.rigidBody;
        if (!body) return;        
        const v = body.velocity;
        if (v.x > 0) {
            v.x = -v.x;
        }
    }

}
import { RigidBody } from "./Entity.js";
import { Component } from "./Component.js";
import { Viewport, Input } from "./Input.js";
export class BallMovementBehavior extends Component {
    constructor() {
        super();
        this.speed = 5;
    }
    start() {
        this._body = this.entity.getComponent(RigidBody);
    }
    update() {
        if (!this._body)
            return;
        const halfBoundHeight = Viewport.size.y / 2;
        // Top bounds
        if (this.entity.position.y > halfBoundHeight) {
            this.entity.position.y = halfBoundHeight;
            this._body.velocity.y = -1;
        }
        // Bottom bounds
        if (this.entity.position.y < -halfBoundHeight) {
            this.entity.position.y = -halfBoundHeight;
            this._body.velocity.y = 1;
        }
        this._body.velocity.normalize();
        this._body.velocity.scale(this.speed);
    }
    reflectVertical() {
        if (!this._body)
            return;
        this._body.velocity.x = -this._body.velocity.x;
    }
}
export class EnemyPaddleBahavior extends Component {
    start() {
        this.entity.position.y = 0;
        this.onViewportSizeChanged();
    }
    update() {
        if (!this.ball)
            return;
        // perfect AI
        this.entity.position.y = this.ball.position.y;
    }
    onViewportSizeChanged() {
        this.entity.position.x = -((Viewport.size.x / 2) - 30);
    }
    onTriggerEnter(other) {
        const otherBody = other.entity.getComponent(RigidBody);
        if (!otherBody)
            return;
        const v = otherBody.velocity;
        if (v.x < 0) {
            v.x = -v.x;
        }
    }
}
export class PlayerPaddleBehavior extends Component {
    constructor() {
        super();
        this.speed = 5;
    }
    start() {
        this.entity.position.y = 0;
        this.onViewportSizeChanged();
    }
    update() {
        if (Input.mousePosition.y < this.entity.position.y) {
            this.entity.position.y -= this.speed;
        }
        else if (Input.mousePosition.y > this.entity.position.y) {
            this.entity.position.y += this.speed;
        }
    }
    onViewportSizeChanged() {
        this.entity.position.x = (Viewport.size.x / 2) - 30;
    }
    onTriggerEnter(other) {
        const otherBody = other.entity.getComponent(RigidBody);
        if (!otherBody)
            return;
        const v = otherBody.velocity;
        if (v.x > 0) {
            v.x = -v.x;
        }
    }
}

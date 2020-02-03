import { RigidBody } from "./Entity.js";
import { Component } from "./Component.js";
import { Viewport } from "./Input.js";
export class ScoringBehavior extends Component {
    constructor(scoreTextUi) {
        super();
        this.score = 0;
        this.scoreTextUi = scoreTextUi;
    }
    onTriggerEnter(collider) {
        if (collider.tags.has('ball')) {
            this.score++;
            if (this.scoreTextUi) {
                this.scoreTextUi.text = this.score.toString();
            }
            collider.entity.sendMessage('reset');
        }
    }
}
export class ProportionalPosition extends Component {
    constructor(position) {
        super();
        this.position = position;
    }
    start() {
        this.onViewportSizeChanged();
    }
    onViewportSizeChanged() {
        this.entity.position.x = (Viewport.size.x / 2) * this.position.x;
        this.entity.position.y = (Viewport.size.y / 2) * this.position.y;
    }
}
export class BallBehavior extends Component {
    constructor() {
        super(...arguments);
        this.baseSpeed = 5;
        this.currentSpeed = 5;
        this.speedIncrement = 0.3;
    }
    start() {
        this._rigidBody = this.entity.getComponent(RigidBody);
        if (!this._rigidBody)
            return;
        this.reset();
    }
    _changeSpeed(value) {
        this.currentSpeed = value;
        if (this._rigidBody) {
            this._rigidBody.velocity.normalize();
            this._rigidBody.velocity.scale(this.currentSpeed);
        }
    }
    reset() {
        this.entity.position.x = 0;
        this.entity.position.y = 0;
        if (this._rigidBody) {
            this._rigidBody.velocity.x = 0.5 + (Math.random() * 2); // favor the x-axis
            this._rigidBody.velocity.y = Math.random();
        }
        this._changeSpeed(this.baseSpeed);
    }
    onTriggerEnter(collider) {
        if (collider.entity.tags.has('paddle')) {
            this._changeSpeed(this.currentSpeed + this.speedIncrement);
        }
    }
}
export class WallBehavior extends Component {
    constructor(_positionScale, _sizeScale, _velocityOffset) {
        super();
        this._positionScale = _positionScale;
        this._sizeScale = _sizeScale;
        this._velocityOffset = _velocityOffset;
    }
    start() {
        this.onViewportSizeChanged();
    }
    onViewportSizeChanged() {
        this.entity.position.x = Viewport.size.x / 2 * this._positionScale.x;
        this.entity.position.y = Viewport.size.y * this._positionScale.y;
        this.entity.size.x = Viewport.size.x * this._sizeScale.x;
        this.entity.size.y = Viewport.size.y * this._sizeScale.y;
    }
    onTriggerEnter(collider) {
        if (collider.entity.tags.has('ball')) {
            const rigidBody = collider.entity.getComponent(RigidBody);
            if (rigidBody) {
                rigidBody.velocity.x *= this._velocityOffset.x;
                rigidBody.velocity.y *= this._velocityOffset.y;
            }
        }
    }
}

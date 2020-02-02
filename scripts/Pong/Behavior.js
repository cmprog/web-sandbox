import { Entity, RigidBody } from "./Entity.js";
import { Component } from "./Component.js";
import { Viewport, Input } from "./Input.js";
import { HtmlElementTextUI } from "./Renderer.js";
export class BallBehavior extends Component {
    constructor() {
        super(...arguments);
        this.speed = 5;
        this.speedIncrement = 0.3;
    }
    start() {
        this._rigidBody = this.entity.getComponent(RigidBody);
        if (!this._rigidBody)
            return;
        this._rigidBody.velocity.normalize();
        this._rigidBody.velocity.scale(this.speed);
    }
    onTriggerEnter(collider) {
        if (collider.entity.tags.has('paddle')) {
            this.speed += this.speedIncrement;
            if (this._rigidBody) {
                this._rigidBody.velocity.normalize();
                this._rigidBody.velocity.scale(this.speed);
            }
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
export class PlayerPaddleBehavior extends Component {
    constructor() {
        super();
        this._score = 0;
        this.speed = 5;
    }
    start() {
        this.entity.position.y = 0;
        this.onViewportSizeChanged();
        const scoreEntity = Entity.find('score');
        if (scoreEntity) {
            this._scoreText = scoreEntity.getComponent(HtmlElementTextUI);
        }
    }
    update() {
        if (Input.mousePosition.y < this.entity.position.y) {
            const delta = this.entity.position.y - Input.mousePosition.y;
            this.entity.position.y -= Math.min(this.speed, delta);
        }
        else if (Input.mousePosition.y > this.entity.position.y) {
            const delta = Input.mousePosition.y - this.entity.position.y;
            this.entity.position.y += Math.min(this.speed, delta);
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
            this._score++;
            if (this._scoreText) {
                this._scoreText.text = this._score.toString();
            }
        }
    }
}

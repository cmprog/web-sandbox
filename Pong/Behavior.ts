import { BoxCollider, RigidBody } from "./Entity.js";
import { Component } from "./Component.js";
import { Viewport } from "./Input.js";
import { Vector2 } from "../Drawing/Vector.js";
import { HtmlElementTextUI } from "./Renderer.js";

export class ScoringBehavior extends Component {

    constructor(scoreTextUi: HtmlElementTextUI) {
        super();

        this.scoreTextUi = scoreTextUi;
    }

    score = 0;
    scoreTextUi: HtmlElementTextUI;

    onTriggerEnter(collider: BoxCollider): void {
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

    constructor(public position: Vector2) {
        super();
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

    private _rigidBody: RigidBody;

    baseSpeed = 5;
    currentSpeed = 5;
    speedIncrement = 0.3;

    start() {
        this._rigidBody = this.entity.getComponent(RigidBody);
        if (!this._rigidBody) return;

        this._rigidBody.velocity.normalize();
        this._rigidBody.velocity.scale(this.currentSpeed);
    }

    reset() {

        this.currentSpeed = this.baseSpeed;
        this.entity.position.x = 0;
        this.entity.position.y = 0;

        if (this._rigidBody) {
            this._rigidBody.velocity.x = Math.random();
            this._rigidBody.velocity.y = Math.random();
            this._rigidBody.velocity.normalize();
            this._rigidBody.velocity.scale(this.currentSpeed);
        }
    }

    onTriggerEnter(collider: BoxCollider): void {
        if (collider.entity.tags.has('paddle')) {
            this.currentSpeed += this.speedIncrement;
            if (this._rigidBody) {
                this._rigidBody.velocity.normalize();
                this._rigidBody.velocity.scale(this.currentSpeed);
            }
        }
    }
}

export class WallBehavior extends Component {

    constructor(
        private readonly _positionScale: Vector2,
        private readonly _sizeScale: Vector2, 
        private readonly _velocityOffset: Vector2) {

        super();
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

    onTriggerEnter(collider: BoxCollider) {
        if (collider.entity.tags.has('ball')) {
            const rigidBody = collider.entity.getComponent(RigidBody);
            if (rigidBody) {
                rigidBody.velocity.x *= this._velocityOffset.x;
                rigidBody.velocity.y *= this._velocityOffset.y;
            }
        }
    }
}
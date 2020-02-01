import { Entity, BoxCollider, RigidBody } from "./Entity.js";
import { Component } from "./Component.js";
import { Viewport, Input } from "./Input.js";
import { HtmlElementTextUI } from "./Renderer.js";

export class BallMovementBehavior extends Component {

    private _body: RigidBody;

    constructor() {
        super();
    }

    speed: number = 5;

    start(): void {
        this._body = this.entity.getComponent(RigidBody);
    }

    update(): void {        

        if (!this._body) return;

        const halfBoundHeight = Viewport.size.y / 2;

        // Top bounds
        if (this.entity.position.y > halfBoundHeight ) {
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

    reflectVertical(): void {
        if (!this._body) return;
        this._body.velocity.x = -this._body.velocity.x;
    }
}

export class PlayerPaddleBehavior extends Component {

    private _score: number = 0;
    private _scoreText: HtmlElementTextUI;    

    constructor() {
        super();
    }

    speed: number = 5;

    start(): void {
        this.entity.position.y = 0;
        this.onViewportSizeChanged();

        const scoreEntity = Entity.find('score');
        if (scoreEntity) {
            this._scoreText = scoreEntity.getComponent(HtmlElementTextUI);
        }
    }

    update(): void {
        if (Input.mousePosition.y < this.entity.position.y) {
            const delta = this.entity.position.y - Input.mousePosition.y;
            this.entity.position.y -= Math.min(this.speed, delta);
        } else if (Input.mousePosition.y > this.entity.position.y) {
            const delta = Input.mousePosition.y - this.entity.position.y;
            this.entity.position.y += Math.min(this.speed, delta);
        }
    }

    onViewportSizeChanged() {        
        this.entity.position.x = (Viewport.size.x / 2) - 30;
    }

    onTriggerEnter(other: BoxCollider) {

        this._score++;
        if (this._scoreText) {
            this._scoreText.text = this._score.toString();
        }

        const otherBody = other.entity.getComponent(RigidBody);
        if (!otherBody) return;        

        const v = otherBody.velocity;
        if (v.x > 0) {
            v.x = -v.x;
        }
    }

}
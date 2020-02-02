import { Component } from "./Component.js";
import { Entity, BoxCollider, RigidBody } from "./Entity.js";

export class AiPaddleBehavior extends Component {

    start(): void {
        this.ball = Entity.find('ball');
    }

    speed = 5;

    ball: Entity;
    
    update(): void {

        if (!this.ball) return;

        if (this.ball.position.y < this.entity.position.y) {
            const delta = this.entity.position.y - this.ball.position.y;
            this.entity.position.y -= Math.min(this.speed, delta);
        } else if (this.ball.position.y > this.entity.position.y) {
            const delta = this.ball.position.y - this.entity.position.y;
            this.entity.position.y += Math.min(this.speed, delta);
        }
    }
}
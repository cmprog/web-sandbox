import { Component } from "./Component.js";
import { Entity } from "./Entity.js";
export class AiPaddleBehavior extends Component {
    constructor() {
        super(...arguments);
        this.speed = 5;
    }
    start() {
        this.ball = Entity.find('ball');
    }
    update() {
        if (!this.ball)
            return;
        if (this.ball.position.y < this.entity.position.y) {
            const delta = this.entity.position.y - this.ball.position.y;
            this.entity.position.y -= Math.min(this.speed, delta);
        }
        else if (this.ball.position.y > this.entity.position.y) {
            const delta = this.ball.position.y - this.entity.position.y;
            this.entity.position.y += Math.min(this.speed, delta);
        }
    }
}

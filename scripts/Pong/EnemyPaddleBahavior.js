import { Component } from "./Component.js";
import { RigidBody } from "./Entity.js";
import { Viewport } from "./Input.js";
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

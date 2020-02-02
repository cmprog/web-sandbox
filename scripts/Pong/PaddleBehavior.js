import { Component } from "./Component.js";
import { RigidBody } from "./Entity.js";
import { Viewport } from "./Input.js";
export class PaddleBehavior extends Component {
    constructor(positionDirection) {
        super();
        this.positionDirection = positionDirection;
    }
    start() {
        this.entity.position.y = 0;
        this.onViewportSizeChanged();
    }
    onViewportSizeChanged() {
        this.entity.position.x = Math.sign(this.positionDirection) * ((Viewport.size.x / 2) - 30);
    }
    onTriggerEnter(other) {
        if (!other.entity.tags.has('ball'))
            return;
        const otherBody = other.entity.getComponent(RigidBody);
        if (!otherBody)
            return;
        const v = otherBody.velocity;
        if (Math.sign(v.x) == Math.sign(this.positionDirection)) {
            v.x = -v.x;
        }
    }
}

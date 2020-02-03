import { Component } from "./Component.js";
import { RigidBody } from "./Entity.js";
import { Viewport } from "./Input.js";
export class PaddleBehavior extends Component {
    constructor(positionDirection) {
        super();
        this.positionDirection = positionDirection;
        this.verticalInfuence = 10.0;
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
        const speed = v.magnitude;
        // flip the direction of the ball
        v.x = -v.x;
        // then adjust the y component based on the relative y-delta
        const deltaY = other.entity.position.y - this.entity.position.y;
        const deltaYPercent = deltaY / (this.entity.size.y / 2);
        v.y += this.verticalInfuence * deltaYPercent;
        v.normalize();
        v.scale(speed);
    }
}

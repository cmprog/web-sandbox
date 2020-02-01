export class BallMovementBehavior {
    constructor(_entity, _bounds) {
        this._entity = _entity;
        this._bounds = _bounds;
        this.speed = 5;
    }
    update() {
        const body = this._entity.rigidBody;
        if (!body)
            return;
        const halfBoundHeight = this._bounds.y / 2;
        // Top bounds
        if (this._entity.position.y > halfBoundHeight) {
            this._entity.position.y = halfBoundHeight;
            body.velocity.y = -1;
        }
        // Bottom bounds
        if (this._entity.position.y < -halfBoundHeight) {
            this._entity.position.y = -halfBoundHeight;
            body.velocity.y = 1;
        }
        body.velocity.normalize();
        body.velocity.scale(this.speed);
    }
    reflectVertical() {
        const body = this._entity.rigidBody;
        if (!body)
            return;
        body.velocity.x = -body.velocity.x;
    }
}
export class EnemyPaddleBahavior {
    constructor(entity) {
        this.entity = entity;
    }
    update() {
        if (!this.ball)
            return;
        // perfect AI
        this.entity.position.y = this.ball.position.y;
    }
    onTriggerEnter(other) {
        const body = other.entity.rigidBody;
        if (!body)
            return;
        const v = body.velocity;
        if (v.x < 0) {
            v.x = -v.x;
        }
    }
}
export class PlayerPaddleBehavior {
    constructor(_entity, _cursorPos) {
        this._entity = _entity;
        this._cursorPos = _cursorPos;
        this.speed = 5;
    }
    update() {
        if (this._cursorPos.y < this._entity.position.y) {
            this._entity.position.y -= this.speed;
        }
        else if (this._cursorPos.y > this._entity.position.y) {
            this._entity.position.y += this.speed;
        }
    }
    onTriggerEnter(other) {
        const body = other.entity.rigidBody;
        if (!body)
            return;
        const v = body.velocity;
        if (v.x > 0) {
            v.x = -v.x;
        }
    }
}

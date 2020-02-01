import { Game } from "../Framework/Game.js";
import { UI } from "../Framework/UI.js";
import { Vector2 } from '../Drawing/Vector.js';
import { Entity, RigidBody, BoxCollider } from "./Entity.js";
import { BallMovementBehavior, PlayerPaddleBehavior, EnemyPaddleBahavior } from "./Behavior.js";
import { Renderer } from "./Renderer.js";
export class PhysicsGame extends Game {
    constructor() {
        super();
        this._entities = new Array();
        this._cusorPos = new Vector2(0, 0);
        this.register(this);
        const bounds = document.body.getBoundingClientRect();
        this._boundingSize = new Vector2(window.innerWidth, window.innerHeight);
        document.addEventListener('mousemove', this._onMouseMove.bind(this));
        window.addEventListener('resize', this._onResize.bind(this));
    }
    get boundingSize() {
        return this._boundingSize;
    }
    get cursorPosition() {
        return this._cusorPos;
    }
    addEntity(entity) {
        this._entities.push(entity);
    }
    _onMouseMove(e) {
        this._cusorPos.x = e.clientX - (this._boundingSize.x / 2);
        this._cusorPos.y = -(e.clientY - (this._boundingSize.y / 2));
    }
    _onResize(e) {
        this._boundingSize.x = window.innerWidth;
        this._boundingSize.y = window.innerHeight;
        this.onResize();
    }
    onResize() {
    }
    update(time) {
        // physics  
        for (const entity of this._entities) {
            if (entity.rigidBody) {
                entity.position.add(entity.rigidBody.velocity);
            }
        }
        // collision detection
        for (let i = 0; i < this._entities.length - 1; i++) {
            const iEntity = this._entities[i];
            if (!iEntity.collider)
                continue;
            const iHalfWidth = iEntity.size.x / 2;
            const iHalfHeight = iEntity.size.y / 2;
            const iLeft = iEntity.position.x - iHalfWidth;
            const iRight = iEntity.position.x + iHalfWidth;
            const iTop = iEntity.position.y + iHalfHeight;
            const iBottom = iEntity.position.y - iHalfHeight;
            for (let j = i + 1; j < this._entities.length; j++) {
                const jEntity = this._entities[j];
                if (!jEntity.collider)
                    continue;
                const jHalfWidth = jEntity.size.x / 2;
                const jHalfHeight = jEntity.size.y / 2;
                const jLeft = jEntity.position.x - jHalfWidth;
                const jRight = jEntity.position.x + jHalfWidth;
                const jTop = jEntity.position.y + jHalfHeight;
                const jBottom = jEntity.position.y - jHalfHeight;
                if ((iLeft < jRight) && (iRight > jLeft)
                    && (iTop > jBottom) && (iBottom < jTop)) {
                    const iBehavior = iEntity.behavior;
                    const jBehavior = jEntity.behavior;
                    if (iBehavior.onTriggerEnter) {
                        iBehavior.onTriggerEnter(jEntity.collider);
                    }
                    if (jBehavior.onTriggerEnter) {
                        jBehavior.onTriggerEnter(iEntity.collider);
                    }
                }
            }
        }
        // update
        for (const entity of this._entities) {
            if (entity.behavior) {
                entity.behavior.update();
            }
        }
        // render                
        for (const entity of this._entities) {
            entity.renderer.update();
        }
    }
}
export class PongGame extends PhysicsGame {
    constructor() {
        super();
        this._paddleMargin = 30;
        this._entityBall = new Entity();
        this._entityBall.renderer = new Renderer(this._entityBall, UI.query('.ball'));
        this._entityBall.renderer.bounds = this.boundingSize;
        this._entityBall.size = this._getSize(UI.query('.ball'));
        this._entityBall.position = new Vector2(0, 0);
        this._entityBall.behavior = new BallMovementBehavior(this._entityBall, this.boundingSize);
        this._entityBall.rigidBody = new RigidBody();
        this._entityBall.rigidBody.velocity = Vector2.createNormalized(1, 1);
        this._entityBall.collider = new BoxCollider(this._entityBall);
        this._entityEnemy = new Entity();
        this._entityEnemy.renderer = new Renderer(this._entityEnemy, UI.query('.paddle.enemy'));
        this._entityEnemy.renderer.bounds = this.boundingSize;
        this._entityEnemy.size = this._getSize(UI.query('.paddle.enemy'));
        this._entityEnemy.position = new Vector2(-((this.boundingSize.x / 2) - this._paddleMargin), 0);
        this._entityEnemy.collider = new BoxCollider(this._entityEnemy);
        const enemyBehavior = new EnemyPaddleBahavior(this._entityEnemy);
        enemyBehavior.ball = this._entityBall;
        this._entityEnemy.behavior = enemyBehavior;
        this._entityPlayer = new Entity();
        this._entityPlayer.renderer = new Renderer(this._entityPlayer, UI.query('.paddle.player'));
        this._entityPlayer.renderer.bounds = this.boundingSize;
        this._entityPlayer.size = this._getSize(UI.query('.paddle.player'));
        this._entityPlayer.position = new Vector2((this.boundingSize.x / 2) - this._paddleMargin, 0);
        this._entityPlayer.behavior = new PlayerPaddleBehavior(this._entityPlayer, this.cursorPosition);
        this._entityPlayer.collider = new BoxCollider(this._entityPlayer);
        this.addEntity(this._entityEnemy);
        this.addEntity(this._entityPlayer);
        this.addEntity(this._entityBall);
    }
    _getSize(el) {
        return new Vector2(el.clientWidth, el.clientHeight);
    }
    onResize() {
        this._entityEnemy.position.x = -((this.boundingSize.x / 2) - this._paddleMargin);
        this._entityPlayer.position.x = (this.boundingSize.x / 2) - this._paddleMargin;
    }
}

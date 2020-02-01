import { UI } from "../Framework/UI.js";
import { Vector2 } from '../Drawing/Vector.js';
import { Entity, RigidBody, BoxCollider } from "./Entity.js";
import { BallMovementBehavior, PlayerPaddleBehavior, EnemyPaddleBahavior } from "./Behavior.js";
import { HtmlElementBoxRenderer } from "./Renderer.js";
import { PhysicsGame } from "./PhysicsGame.js";
export class PongGame extends PhysicsGame {
    constructor() {
        super();
        this._paddleMargin = 30;
        this._entityBall = new Entity('ball');
        this._entityBall.size = new Vector2(10, 10);
        this._entityBall.addComponent(HtmlElementBoxRenderer, UI.query('.ball'), 'green');
        this._entityBall.addComponent(BallMovementBehavior);
        this._entityBall.addComponent(RigidBody, Vector2.createNormalized(1, 1));
        this._entityBall.addComponent(BoxCollider);
        this._entityEnemy = new Entity('enemy');
        this._entityEnemy.size = new Vector2(10, 100);
        this._entityEnemy.addComponent(HtmlElementBoxRenderer, UI.query('.paddle.enemy'), 'red');
        this._entityEnemy.addComponent(BoxCollider);
        const enemyBehavior = this._entityEnemy.addComponent(EnemyPaddleBahavior);
        enemyBehavior.ball = this._entityBall;
        this._entityPlayer = new Entity('player');
        this._entityPlayer.size = new Vector2(10, 100);
        this._entityPlayer.addComponent(HtmlElementBoxRenderer, UI.query('.paddle.player'), 'blue');
        this._entityPlayer.addComponent(PlayerPaddleBehavior);
        this._entityPlayer.addComponent(BoxCollider);
        PhysicsGame.addEntity(this._entityEnemy);
        PhysicsGame.addEntity(this._entityPlayer);
        PhysicsGame.addEntity(this._entityBall);
    }
}

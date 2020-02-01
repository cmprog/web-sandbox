import { Vector2 } from '../Drawing/Vector.js';
import { Entity, RigidBody, BoxCollider } from "./Entity.js";
import { BallMovementBehavior, PlayerPaddleBehavior } from "./Behavior.js";
import { HtmlElementBoxRenderer, HtmlElementTextUI } from "./Renderer.js";
import { PhysicsGame } from "./PhysicsGame.js";
import { EnemyPaddleBahavior } from './EnemyPaddleBahavior.js';
export class PongGame extends PhysicsGame {
    constructor() {
        super();
        var scoreEntity = new Entity('score');
        scoreEntity.size = new Vector2(200, 50);
        scoreEntity.addComponent(HtmlElementTextUI, '0', 'white');
        scoreEntity.addComponent(HtmlElementBoxRenderer);
        PhysicsGame.addEntity(scoreEntity);
        this._entityBall = new Entity('ball');
        this._entityBall.size = new Vector2(10, 10);
        let renderer = this._entityBall.addComponent(HtmlElementBoxRenderer, 'green');
        renderer.radius = 5;
        this._entityBall.addComponent(BallMovementBehavior);
        this._entityBall.addComponent(RigidBody, Vector2.createNormalized(1, 1));
        this._entityBall.addComponent(BoxCollider);
        PhysicsGame.addEntity(this._entityBall);
        this._entityEnemy = new Entity('enemy');
        this._entityEnemy.size = new Vector2(10, 100);
        this._entityEnemy.addComponent(HtmlElementBoxRenderer, 'red');
        this._entityEnemy.addComponent(BoxCollider);
        const enemyBehavior = this._entityEnemy.addComponent(EnemyPaddleBahavior);
        enemyBehavior.ball = this._entityBall;
        PhysicsGame.addEntity(this._entityEnemy);
        this._entityPlayer = new Entity('player');
        this._entityPlayer.size = new Vector2(10, 100);
        this._entityPlayer.addComponent(HtmlElementBoxRenderer, 'blue');
        this._entityPlayer.addComponent(PlayerPaddleBehavior);
        this._entityPlayer.addComponent(BoxCollider);
        PhysicsGame.addEntity(this._entityPlayer);
    }
}

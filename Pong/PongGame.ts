
import { Vector2 } from '../Drawing/Vector.js';
import { Entity, RigidBody, BoxCollider } from "./Entity.js";
import { WallBehavior, BallBehavior, ProportionalPosition, ScoringBehavior } from "./Behavior.js";
import { HtmlElementBoxRenderer, HtmlElementTextUI } from "./Renderer.js";
import { PhysicsGame } from "./PhysicsGame.js";
import { AiPaddleBehavior } from './EnemyPaddleBahavior.js';
import { PlayerPaddleBehavior } from './PlayerPaddleBehavior.js';
import { PaddleBehavior } from './PaddleBehavior.js';

export class PongGame extends PhysicsGame {
    
    private readonly _entityBall: Entity;
    private readonly _entityPlayer: Entity;
    private readonly _entityEnemy: Entity;

    constructor() {
        super();

        const playerScore = new Entity();        
        playerScore.size = new Vector2(20, 20);
        playerScore.addComponent(ProportionalPosition, new Vector2(0.15, 0.8));
        playerScore.addComponent(HtmlElementTextUI, '0');
        playerScore.addComponent(HtmlElementBoxRenderer, 'white');
        PhysicsGame.addEntity(playerScore);

        const enemyScore = new Entity();        
        enemyScore.size = new Vector2(20, 20);
        enemyScore.addComponent(ProportionalPosition, new Vector2(-0.15, 0.8));
        enemyScore.addComponent(HtmlElementTextUI, '0');
        enemyScore.addComponent(HtmlElementBoxRenderer, 'white');
        PhysicsGame.addEntity(enemyScore);

        this._entityBall = new Entity('ball');
        this._entityBall.size = new Vector2(10, 10);
        this._entityBall.addComponent(BallBehavior);
        let renderer = this._entityBall.addComponent(HtmlElementBoxRenderer, 'green');
        renderer.radius = 5;
        this._entityBall.addComponent(RigidBody, Vector2.createNormalized(1, 1));
        this._entityBall.addComponent(BoxCollider);
        PhysicsGame.addEntity(this._entityBall);

        this._entityEnemy = new Entity('paddle', 'enemy');
        this._entityEnemy.size = new Vector2(10, 100);
        this._entityEnemy.addComponent(HtmlElementBoxRenderer, 'red');        
        this._entityEnemy.addComponent(BoxCollider);
        this._entityEnemy.addComponent(PaddleBehavior, -1);
        this._entityEnemy.addComponent(AiPaddleBehavior);
        PhysicsGame.addEntity(this._entityEnemy);

        this._entityPlayer = new Entity('paddle', 'player');
        this._entityPlayer.size = new Vector2(10, 100);
        this._entityPlayer.addComponent(HtmlElementBoxRenderer, 'blue');
        this._entityPlayer.addComponent(PaddleBehavior, 1);
        this._entityPlayer.addComponent(PlayerPaddleBehavior);
        this._entityPlayer.addComponent(BoxCollider);
        PhysicsGame.addEntity(this._entityPlayer);

        const wallTop = new Entity('wall', 'wall-horizontal', 'wall-top');
        wallTop.addComponent(WallBehavior, new Vector2(0, 1), new Vector2(1, 1), new Vector2(1, -1));        
        wallTop.addComponent(BoxCollider);
        PhysicsGame.addEntity(wallTop);

        const wallBottom = new Entity('wall', 'wall-horizontal', 'wall-bottom');
        wallBottom.addComponent(WallBehavior, new Vector2(0, -1), new Vector2(1, 1), new Vector2(1, -1));
        wallBottom.addComponent(BoxCollider);
        PhysicsGame.addEntity(wallBottom);

        const wallRight = new Entity('wall', 'wall-vertical', 'wall-right');
        wallRight.addComponent(ScoringBehavior, enemyScore.getComponent(HtmlElementTextUI));
        wallRight.addComponent(WallBehavior, new Vector2(1.1, 0), new Vector2(0.1, 1), new Vector2(-1, 1));
        wallRight.addComponent(HtmlElementBoxRenderer, 'gray');
        wallRight.addComponent(BoxCollider);
        PhysicsGame.addEntity(wallRight);

        const wallLeft = new Entity('wall', 'wall-vertical', 'wall-left');
        wallLeft.addComponent(ScoringBehavior, playerScore.getComponent(HtmlElementTextUI));
        wallLeft.addComponent(WallBehavior, new Vector2(-1.1, 0), new Vector2(0.1, 1), new Vector2(-1, 1));
        wallLeft.addComponent(HtmlElementBoxRenderer, 'gray');
        wallLeft.addComponent(BoxCollider);
        PhysicsGame.addEntity(wallLeft);
    }
}
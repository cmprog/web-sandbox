import { Game } from "../Framework/Game.js";
import { BoxCollider, RigidBody } from "./Entity.js";
import { Input, Viewport } from "./Input.js";
export class PhysicsGame extends Game {
    constructor() {
        super();
        this._entities = new Array();
        this._entitiesPendingAdd = new Array();
        this._entitiesPendingRemove = new Array();
        if (PhysicsGame._instance) {
            throw new Error('Cannot have multiple PhysicsGame objects.');
        }
        PhysicsGame._instance = this;
        this.register(this);
        Input.initialize();
        Viewport.initialize();
    }
    static addEntity(entity) {
        PhysicsGame._instance._entitiesPendingAdd.push(entity);
    }
    static removeEntity(entity) {
        PhysicsGame._instance._entitiesPendingRemove.push(entity);
    }
    /**
     * Sends a message to all components for all entities.
     * @param name The name of the message to broadcast.
     * @param arg0 An additional argument to include.
     */
    static broadcastMessage(name, arg0 = null) {
        for (const entity of PhysicsGame._instance._entities) {
            entity.sendMessage(name, arg0);
        }
    }
    update(time) {
        // add pending entities
        for (const entity of this._entitiesPendingAdd) {
            this._entities.push(entity);
            entity.sendMessage('start');
        }
        this._entitiesPendingAdd.length = 0;
        // physics  
        for (const entity of this._entities) {
            const rigidBody = entity.getComponent(RigidBody);
            if (rigidBody) {
                entity.position.add(rigidBody.velocity);
            }
        }
        // collision detection
        for (let i = 0; i < this._entities.length - 1; i++) {
            const iEntity = this._entities[i];
            const iCollider = iEntity.getComponent(BoxCollider);
            if (!iCollider)
                continue;
            const iHalfWidth = iEntity.size.x / 2;
            const iHalfHeight = iEntity.size.y / 2;
            const iLeft = iEntity.position.x - iHalfWidth;
            const iRight = iEntity.position.x + iHalfWidth;
            const iTop = iEntity.position.y + iHalfHeight;
            const iBottom = iEntity.position.y - iHalfHeight;
            for (let j = i + 1; j < this._entities.length; j++) {
                const jEntity = this._entities[j];
                const jCollider = jEntity.getComponent(BoxCollider);
                if (!jCollider)
                    continue;
                const jHalfWidth = jEntity.size.x / 2;
                const jHalfHeight = jEntity.size.y / 2;
                const jLeft = jEntity.position.x - jHalfWidth;
                const jRight = jEntity.position.x + jHalfWidth;
                const jTop = jEntity.position.y + jHalfHeight;
                const jBottom = jEntity.position.y - jHalfHeight;
                if ((iLeft < jRight) && (iRight > jLeft)
                    && (iTop > jBottom) && (iBottom < jTop)) {
                    iEntity.sendMessage('onTriggerEnter', jCollider);
                    jEntity.sendMessage('onTriggerEnter', iCollider);
                }
            }
        }
        // update
        for (const entity of this._entities) {
            entity.sendMessage('update');
        }
        // remove pending entities
        for (const entity of this._entitiesPendingRemove) {
            const i = this._entities.indexOf(entity);
            if (i >= 0) {
                this._entities.splice(i, 1);
            }
        }
        this._entitiesPendingRemove.length = 0;
        // render                
        for (const entity of this._entities) {
            entity.sendMessage('onRenderObject');
        }
    }
}

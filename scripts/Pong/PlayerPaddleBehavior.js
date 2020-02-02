import { Component } from "./Component.js";
import { Input } from "./Input.js";
export class PlayerPaddleBehavior extends Component {
    constructor() {
        super();
        this._score = 0;
        this.speed = 5;
    }
    update() {
        if (Input.mousePosition.y < this.entity.position.y) {
            const delta = this.entity.position.y - Input.mousePosition.y;
            this.entity.position.y -= Math.min(this.speed, delta);
        }
        else if (Input.mousePosition.y > this.entity.position.y) {
            const delta = Input.mousePosition.y - this.entity.position.y;
            this.entity.position.y += Math.min(this.speed, delta);
        }
    }
}

import { Component } from "./Component.js";
import { Input } from "./Input.js";

export class PlayerPaddleBehavior extends Component {

    private _score: number = 0;

    constructor() {
        super();
    }

    speed: number = 5;

    update(): void {
        if (Input.mousePosition.y < this.entity.position.y) {
            const delta = this.entity.position.y - Input.mousePosition.y;
            this.entity.position.y -= Math.min(this.speed, delta);
        } else if (Input.mousePosition.y > this.entity.position.y) {
            const delta = Input.mousePosition.y - this.entity.position.y;
            this.entity.position.y += Math.min(this.speed, delta);
        }
    }

}
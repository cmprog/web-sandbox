import { GameTime } from "./GameTime.js";

export interface Updatable {
    update(time: GameTime);
}

export interface FixedUpdatable {
    fixedUpdate(time: GameTime);
}
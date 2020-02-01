import { FixedUpdatable } from './Updatable.js'
import { Property } from './Property.js';
import { GameTime } from './GameTime.js';

export interface GeneratorCallback {
    (): void;
}

export class TickCountdownGenerator implements FixedUpdatable {
    
    constructor(
        private readonly _remainingTickCount: Property, 
        private readonly _resetTickCount: Property,
        private readonly _callback: GeneratorCallback) {
    }

    fixedUpdate(time: GameTime) {      
        
        let timeRemaining = this._remainingTickCount.value - 1;

        if (timeRemaining <= 0) {
            this._callback();
            timeRemaining = this._resetTickCount.value;
        }

        this._remainingTickCount.value = timeRemaining;
    }

}
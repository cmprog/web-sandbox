import { Property } from './Property.js';

export class GameTime {

    readonly totalTimeMs = new Property(0);
    readonly totalTimeS = new Property(0);

    readonly deltaTimeMs = new Property(0);
    readonly deltaTimeS = new Property(0);

    readonly totalTickCount = new Property(0);
    readonly tickTimeMs = new Property(0);
    readonly tickTimeS = new Property(0);
    readonly tickDurationMs = new Property(1000);

    addDeltaTimeMs(time: number) {
        
        this.totalTimeMs.value += time;
        this.totalTimeS.value = this.totalTimeMs.value / 1000;

        this.deltaTimeMs.value = time;
        this.deltaTimeS.value = time / 1000;
    }

    tick(durationMs: number) {        
        this.tickTimeMs.value += durationMs;
        this.tickTimeS.value = this.tickTimeMs.value / 1000;
        this.totalTickCount.value += 1;
    }

}
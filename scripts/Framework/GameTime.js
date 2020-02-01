import { Property } from './Property.js';
export class GameTime {
    constructor() {
        this.totalTimeMs = new Property(0);
        this.totalTimeS = new Property(0);
        this.deltaTimeMs = new Property(0);
        this.deltaTimeS = new Property(0);
        this.totalTickCount = new Property(0);
        this.tickTimeMs = new Property(0);
        this.tickTimeS = new Property(0);
        this.tickDurationMs = new Property(1000);
    }
    addDeltaTimeMs(time) {
        this.totalTimeMs.value += time;
        this.totalTimeS.value = this.totalTimeMs.value / 1000;
        this.deltaTimeMs.value = time;
        this.deltaTimeS.value = time / 1000;
    }
    tick(durationMs) {
        this.tickTimeMs.value += durationMs;
        this.tickTimeS.value = this.tickTimeMs.value / 1000;
        this.totalTickCount.value += 1;
    }
}

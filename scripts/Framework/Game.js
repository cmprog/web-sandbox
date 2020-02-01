import { GameTime } from "./GameTime.js";
import { TemplateContext } from "./Bindings.js";
export class Game {
    constructor() {
        this._updatables = new Array();
        this._fixedUpdatables = new Array();
        this._time = new GameTime();
        this._boundAnimationFrameCallback = this._onAnimationFrame.bind(this);
    }
    get time() {
        return this._time;
    }
    _onInitialAnimationFrame(timestamp) {
        this._previousTimestamp = timestamp;
        this._previousTickTimestamp = timestamp;
        this._updatables.forEach(x => x.update(this._time));
        window.requestAnimationFrame(this._boundAnimationFrameCallback);
    }
    _onAnimationFrame(timestamp) {
        this._time.addDeltaTimeMs(timestamp - this._previousTimestamp);
        this._previousTimestamp = timestamp;
        const tickDurationMs = this.time.tickDurationMs.value;
        if (timestamp >= this._previousTickTimestamp + tickDurationMs) {
            const timeSinceLastTick = timestamp - this._previousTickTimestamp;
            const tickCount = Math.floor(timeSinceLastTick / tickDurationMs);
            for (let i = 0; i < tickCount; i += 1) {
                this._previousTickTimestamp = this._previousTickTimestamp + tickDurationMs;
                this._time.tick(tickDurationMs);
                this._fixedUpdatables.forEach(x => x.fixedUpdate(this._time));
            }
        }
        this._updatables.forEach(x => x.update(this._time));
        window.requestAnimationFrame(this._boundAnimationFrameCallback);
    }
    run() {
        window.requestAnimationFrame(this._onInitialAnimationFrame.bind(this));
    }
    register(component) {
        if (this._isUpdatable(component)) {
            this._updatables.push(component);
        }
        if (this._isFixedUpdatable(component)) {
            this._fixedUpdatables.push(component);
        }
        if (this._isTemplate(component)) {
            const context = new TemplateContext(document.body);
            component.attachTemplateBindings(context);
        }
    }
    unregister(component) {
        if (this._isUpdatable(component)) {
            this.removeItem(this._updatables, component);
        }
        if (this._isFixedUpdatable(component)) {
            this.removeItem(this._fixedUpdatables, component);
        }
    }
    removeItem(items, item) {
        const index = items.indexOf(item);
        if (index >= 0) {
            items.splice(index, 1);
        }
    }
    _isTemplate(component) {
        return component.attachTemplateBindings !== undefined;
    }
    _isUpdatable(component) {
        return component.update !== undefined;
    }
    _isFixedUpdatable(component) {
        return component.fixedUpdate !== undefined;
    }
}

import { Updatable, FixedUpdatable } from "./Updatable.js";
import { GameTime } from "./GameTime.js";
import { TemplateComponent, TemplateContext } from "./Bindings.js";

export class Game {
    
    private readonly _boundAnimationFrameCallback : () => void;

    private readonly _updatables = new Array<Updatable>();
    private readonly _fixedUpdatables = new Array<FixedUpdatable>();

    private _previousTimestamp: number;
    private _previousTickTimestamp: number;
    private readonly _time = new GameTime();

    constructor() {
        this._boundAnimationFrameCallback = this._onAnimationFrame.bind(this);
    }

    get time(): GameTime {
        return this._time;
    }
    
    _onInitialAnimationFrame(timestamp: DOMHighResTimeStamp) {
        this._previousTimestamp = timestamp;
        this._previousTickTimestamp = timestamp;        
        this._updatables.forEach(x => x.update(this._time));
        window.requestAnimationFrame(this._boundAnimationFrameCallback);
    }

    _onAnimationFrame(timestamp: DOMHighResTimeStamp) {        
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

    register(component: any) {

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

    unregister(component: any) {
        
        if (this._isUpdatable(component)) {
            this.removeItem(this._updatables, component);
        }

        if (this._isFixedUpdatable(component)) {
            this.removeItem(this._fixedUpdatables, component);
        }
    }

    private removeItem<T>(items: Array<T>, item: T) {
        const index = items.indexOf(item);
        if (index >= 0) {
            items.splice(index, 1);
        }
    }

    private _isTemplate(component: any): component is TemplateComponent {
        return (component as TemplateComponent).attachTemplateBindings !== undefined;
    }

    private _isUpdatable(component: any): component is Updatable {
        return (component as Updatable).update !== undefined;
    }

    private _isFixedUpdatable(component: any): component is FixedUpdatable {
        return (component as FixedUpdatable).fixedUpdate !== undefined;
    }
}
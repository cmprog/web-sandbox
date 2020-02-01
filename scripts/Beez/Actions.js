import { Property } from "../Framework/Property.js";
import { GameEvent, EmptyEventArgs } from "../Framework/Event.js";
export class TimedAction {
    constructor() {
        this._ticks = 0;
        this._remainingTicks = 0;
        this._isActive = false;
        this._isCancelled = false;
        this.progress = new Property(0);
        this._completedEvent = new GameEvent(this);
        this._cancelledEvent = new GameEvent(this);
    }
    get completed() {
        return this._completedEvent.handlerSet;
    }
    get cancelled() {
        return this._cancelledEvent.handlerSet;
    }
    /**
     * Called when the action has been canceled after it has been started.
     * This hook gives actions a chance to roll back any chances made during
     * the start of the action.
     */
    _onActiveCancelling() {
    }
    start() {
        if (this._isCancelled) {
            this._completedEvent.dispatch(EmptyEventArgs.instance);
            return;
        }
        this._ticks = this._getDuraction();
        this._remainingTicks = this._ticks;
        if (this._ticks == null) {
            // The action is stale, generally because it was queued in a good
            // state but a previously queued action invalidated the state
            this._completedEvent.dispatch(EmptyEventArgs.instance);
            return;
        }
        if (this._remainingTicks <= 0) {
            // The action is already complete - this can happen for instantanious actions.            
            this.progress.value = 1.0;
            this._execute();
            this._completedEvent.dispatch(EmptyEventArgs.instance);
            return;
        }
        this.progress.value = 0;
        this._isActive = true;
    }
    cancel() {
        if (this._isActive) {
            this._onActiveCancelling();
        }
        this._isActive = false;
        this._cancelledEvent.dispatch(EmptyEventArgs.instance);
    }
    fixedUpdate(time) {
        if (!this._isActive)
            return;
        this._remainingTicks--;
        if (this._remainingTicks <= 0) {
            this.progress.value = 1.0;
        }
        else {
            this.progress.value = (this._ticks - this._remainingTicks) / this._ticks;
        }
        if (this._remainingTicks <= 0) {
            this._execute();
            this._completedEvent.dispatch(EmptyEventArgs.instance);
            this._isActive = false;
        }
    }
    attachTemplateBindings(context) {
        context.progressBar('.progress', this.progress, null);
        context.bindCommand('.cancel', this.cancel.bind(this));
    }
}

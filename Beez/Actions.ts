import { Property } from "../Framework/Property.js";
import { GameEvent, GameEventHandlerSet, EmptyEventArgs } from "../Framework/Event.js";
import { FixedUpdatable } from "../Framework/Updatable.js";
import { GameTime } from "../Framework/GameTime.js";
import { TemplateComponent, TemplateContext } from "../Framework/Bindings.js";

/**
 * A queueable asynchronous action.
 */
export interface Action {

    /**
     * The percent progress of the action.
     */
    readonly progress: Property;

    /**
     * Fired when the action is complete.
     */
    completed: GameEventHandlerSet<Action>;

    /**
     * Fired after the action is cancelled. Can be fired before the action is started.
     */
    cancelled: GameEventHandlerSet<Action>;

    /**
     * Starts the asynchronous action.
     */
    start(): void;

    /**
     * Cancels the asynchronous action.
     */
    cancel(): void;
}

export abstract class TimedAction implements Action, FixedUpdatable, TemplateComponent {
    
    private _ticks = 0;
    private _remainingTicks = 0;
    private _isActive = false;
    private _isCancelled = false;

    readonly progress = new Property(0);
    
    private readonly _completedEvent = new GameEvent<Action>(this);
    get completed(): GameEventHandlerSet<Action> {
        return this._completedEvent.handlerSet;
    }

    private readonly _cancelledEvent = new GameEvent<Action>(this);
    get cancelled(): GameEventHandlerSet<Action> {
        return this._cancelledEvent.handlerSet;
    }

    /**
     * Gets the duration of this action. This is done just-in-time
     * when the action is started. A null duration indicates the
     * action is no longer valid.
     */
    protected abstract _getDuraction(): number;

    /**
     * Called on completion of the timer.
     */
    protected abstract _execute(): void;

    /**
     * Called when the action has been canceled after it has been started.
     * This hook gives actions a chance to roll back any chances made during
     * the start of the action.
     */
    protected _onActiveCancelling(): void {

    }

    start(): void {

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

    cancel(): void {

        if (this._isActive) {
            this._onActiveCancelling();
        }

        this._isActive = false;
        this._cancelledEvent.dispatch(EmptyEventArgs.instance);
    }

    fixedUpdate(time: GameTime) {

        if (!this._isActive) return;
        this._remainingTicks--;

        if (this._remainingTicks <= 0) {
            this.progress.value = 1.0;
        } else {
            this.progress.value = (this._ticks - this._remainingTicks) / this._ticks;
        }        

        if (this._remainingTicks <= 0) {
            this._execute();
            this._completedEvent.dispatch(EmptyEventArgs.instance);
            this._isActive = false;
        }
    }

    attachTemplateBindings(context: TemplateContext) {
        context.progressBar('.progress', this.progress, null);
        context.bindCommand('.cancel', this.cancel.bind(this));
    }
}
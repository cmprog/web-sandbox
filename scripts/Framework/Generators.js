export class TickCountdownGenerator {
    constructor(_remainingTickCount, _resetTickCount, _callback) {
        this._remainingTickCount = _remainingTickCount;
        this._resetTickCount = _resetTickCount;
        this._callback = _callback;
    }
    fixedUpdate(time) {
        let timeRemaining = this._remainingTickCount.value - 1;
        if (timeRemaining <= 0) {
            this._callback();
            timeRemaining = this._resetTickCount.value;
        }
        this._remainingTickCount.value = timeRemaining;
    }
}

export class FixedNumberFormatter {
    constructor(_fractionalDigits) {
        this._fractionalDigits = _fractionalDigits;
        if (this._fractionalDigits == null) {
            this._fractionalDigits = 2;
        }
    }
    toString(v) {
        return v.toFixed(this._fractionalDigits);
    }
}
export class CurrencyNumberFormatter {
    toString(v) {
        return '$' + v.toFixed(2);
    }
}
export class Formatters {
    static get Fixed_0() {
        return Formatters._fixed_0;
    }
    static get Fixed_2() {
        return Formatters._fixed_2;
    }
    static get Currency() {
        return Formatters._currency;
    }
}
Formatters._fixed_0 = new FixedNumberFormatter(0);
Formatters._fixed_2 = new FixedNumberFormatter(2);
Formatters._currency = new CurrencyNumberFormatter();

export interface NumberFormatter {
    toString(v: number): string;
}

export class FixedNumberFormatter implements NumberFormatter {

    constructor(private _fractionalDigits: number) {
        if (this._fractionalDigits == null) {
            this._fractionalDigits = 2;
        }
    }

    toString(v: number): string {
        return v.toFixed(this._fractionalDigits);
    }
}

export class CurrencyNumberFormatter implements NumberFormatter {

    toString(v: number): string {
        return '$' + v.toFixed(2);
    }

}

export class Formatters {

    private static _fixed_0 = new FixedNumberFormatter(0);
    static get Fixed_0(): NumberFormatter {
        return Formatters._fixed_0;
    }

    private static _fixed_2 = new FixedNumberFormatter(2);
    static get Fixed_2(): NumberFormatter {
        return Formatters._fixed_2;
    }

    private static _currency = new CurrencyNumberFormatter();
    static get Currency(): NumberFormatter {
        return Formatters._currency;
    }
}

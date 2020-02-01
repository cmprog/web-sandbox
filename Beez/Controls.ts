import { Property } from "../Framework/Property.js";
import { UI } from "../Framework/UI.js";
import { ElementConfig } from "../Framework/Bindings.js";

export class ProgressBar {

    private readonly _valueBar = document.createElement('div');

    constructor(
        private readonly _element: HTMLElement,
        private readonly _value: Property,
        private readonly _maximum: Property) {

        this._element.classList.add('progress-container');
        this._valueBar.classList.add('bar');

        UI.removeAllChildren(this._element);
        this._element.appendChild(this._valueBar);

        const callback = this.update.bind(this);
        this._value.valueChanged.add(callback);

        if (this._maximum) {
            this._maximum.valueChanged.add(callback);
        }        
    }

    private update(): void {
        const max = this._maximum ? this._maximum.value : 1.0;
        const percentage = this._value.value / max;        
        this._valueBar.style.width = `${(100 * percentage)}%`;
    }

    static attach(element: HTMLElement, value: Property, maximum: Property): ProgressBar {
        const bar = new ProgressBar(element, value, maximum);
        const config = ElementConfig.fromElement(element);
        config.control = bar;
        return bar;
    }
}

export class DualProgressBar {

    private readonly _secondaryBar = document.createElement('div');
    private readonly _primaryBar = document.createElement('div');

    constructor(
        private readonly _element: HTMLElement, 
        private readonly _primary: Property,
        private readonly _secondary: Property,
        private readonly _maximum: Property) {
        
        this._element.classList.add('progress-container');        
        this._primaryBar.classList.add('primary', 'bar');
        this._secondaryBar.classList.add('secondary', 'bar');

        UI.removeAllChildren(this._element);
        this._element.appendChild(this._primaryBar);
        this._element.appendChild(this._secondaryBar);

        const callback = this._update.bind(this);
        this._primary.valueChanged.add(callback);
        this._secondary.valueChanged.add(callback);
        this._maximum.valueChanged.add(callback);
        this._update();
    }

    get defaultTitle(): string {
        return this._element.title;
    }

    set defaultTitle(v: string) {
        this._element.title = v;
    }

    get primaryTitle(): string {
        return this._primaryBar.title;
    }

    set primaryTitle(v: string) {
        this._primaryBar.title = v;
    }

    get secondaryTitle(): string {
        return this._secondaryBar.title;
    }

    set secondaryTitle(v: string) {
        this._secondaryBar.title = v;
    }

    private _update() {
        
        const primaryPercentage = this._primary.value / this._maximum.value;
        const secondaryPercentage = this._secondary.value / this._maximum.value;

        this._secondaryBar.style.width = `${(100 * secondaryPercentage)}%`;
        this._primaryBar.style.width = `${(100 * (primaryPercentage + secondaryPercentage))}%`;
    }

    static attach(element: HTMLElement, primary: Property, secondary: Property, maximum: Property): DualProgressBar {
        const bar = new DualProgressBar(element, primary, secondary, maximum);
        const config = ElementConfig.fromElement(element);
        config.control = bar;
        return bar;
    }
}
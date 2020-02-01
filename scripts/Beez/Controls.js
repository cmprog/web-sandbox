import { UI } from "../Framework/UI.js";
import { ElementConfig } from "../Framework/Bindings.js";
export class ProgressBar {
    constructor(_element, _value, _maximum) {
        this._element = _element;
        this._value = _value;
        this._maximum = _maximum;
        this._valueBar = document.createElement('div');
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
    update() {
        const max = this._maximum ? this._maximum.value : 1.0;
        const percentage = this._value.value / max;
        this._valueBar.style.width = `${(100 * percentage)}%`;
    }
    static attach(element, value, maximum) {
        const bar = new ProgressBar(element, value, maximum);
        const config = ElementConfig.fromElement(element);
        config.control = bar;
        return bar;
    }
}
export class DualProgressBar {
    constructor(_element, _primary, _secondary, _maximum) {
        this._element = _element;
        this._primary = _primary;
        this._secondary = _secondary;
        this._maximum = _maximum;
        this._secondaryBar = document.createElement('div');
        this._primaryBar = document.createElement('div');
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
    get defaultTitle() {
        return this._element.title;
    }
    set defaultTitle(v) {
        this._element.title = v;
    }
    get primaryTitle() {
        return this._primaryBar.title;
    }
    set primaryTitle(v) {
        this._primaryBar.title = v;
    }
    get secondaryTitle() {
        return this._secondaryBar.title;
    }
    set secondaryTitle(v) {
        this._secondaryBar.title = v;
    }
    _update() {
        const primaryPercentage = this._primary.value / this._maximum.value;
        const secondaryPercentage = this._secondary.value / this._maximum.value;
        this._secondaryBar.style.width = `${(100 * secondaryPercentage)}%`;
        this._primaryBar.style.width = `${(100 * (primaryPercentage + secondaryPercentage))}%`;
    }
    static attach(element, primary, secondary, maximum) {
        const bar = new DualProgressBar(element, primary, secondary, maximum);
        const config = ElementConfig.fromElement(element);
        config.control = bar;
        return bar;
    }
}

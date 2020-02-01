import { Component } from "./Component.js";
import { Viewport } from "./Input.js";
export class HtmlElementBoxRenderer extends Component {
    constructor(_element, color) {
        super();
        this._element = _element;
        this._element.style.position = 'absolute';
        this.color = color;
    }
    get color() {
        return this._element.style.backgroundColor;
    }
    set color(value) {
        this._element.style.backgroundColor = value;
    }
    onRenderObject() {
        const style = this._element.style;
        const size = this.entity.size;
        const pos = this.entity.position;
        // Adjust for size
        const left = Viewport.toWindowX(pos.x) - size.x / 2;
        const top = Viewport.toWindowY(pos.y) - size.y / 2;
        this._element.setAttribute('game-x', pos.x.toString());
        this._element.setAttribute('game-y', pos.y.toString());
        style.left = `${left}px`;
        style.top = `${top}px`;
        style.width = `${size.x}px`;
        style.height = `${size.y}px`;
    }
}

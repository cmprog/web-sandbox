import { Component } from "./Component.js";
import { Viewport } from "./Input.js";

export class HtmlElementComponent extends Component {
    constructor() {
        super();

        this.element = document.createElement('div');
        document.body.appendChild(this.element);
    }

    public readonly element: HTMLElement;
}

export class HtmlElementTextUI extends Component {

    private _elComponent: HtmlElementComponent

    private _text: string;
    private _textColor: string;

    constructor(text: string, textColor: string) {
        super();
        
        this.text = text;
        this.textColor = textColor;
    }

    start() {
        this._elComponent = this.entity.getComponent(HtmlElementComponent);
        if (!this._elComponent) {
            this._elComponent = this.entity.addComponent(HtmlElementComponent);
        }

        const element = this._elComponent.element;
        element.style.textAlign = 'center';
        element.innerText = this.text;
        element.style.color = this.textColor;
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
        if (this._elComponent) {
            this._elComponent.element.innerText = value;
        }        
    }

    get textColor(): string {
        return this._textColor;
    }

    set textColor(value: string) {
        this._textColor = value;
        if (this._elComponent) {
            this._elComponent.element.innerText = value;
        }
    }
}

export class HtmlElementBoxRenderer extends Component {

    private _elComponent: HtmlElementComponent;
    private _radius: number = 0;
    private _color: string;

    constructor(color: string) {
        super();

        this.color = color;
    }

    start() {        
        this._elComponent = this.entity.getComponent(HtmlElementComponent);
        if (!this._elComponent) {
            this._elComponent = this.entity.addComponent(HtmlElementComponent);
        }

        const element = this._elComponent.element;
        element.style.backgroundColor = this.color;
        element.style.borderRadius = `${this.radius}px`;
    }

    get color(): string {
        return this._color;
    }

    set color(value: string) {
        this._color = value;
        if (this._elComponent) {
            this._elComponent.element.style.backgroundColor = value;
        }
    }

    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
        if (this._elComponent) {
            this._elComponent.element.style.borderRadius = `${value}px`;
        }
    }

    onRenderObject(): void {
        
        const style = this._elComponent.element.style;
        const size = this.entity.size;
        const pos = this.entity.position;

        // Adjust for size
        const left = Viewport.toWindowX(pos.x) - size.x / 2;
        const top = Viewport.toWindowY(pos.y) - size.y / 2;

        style.left = `${left}px`;
        style.top = `${top}px`;

        style.width = `${size.x}px`;
        style.height = `${size.y}px`;
    }
}
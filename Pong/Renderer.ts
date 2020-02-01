import { Component } from "./Component.js";
import { Viewport } from "./Input.js";

export class Renderer extends Component {

    constructor(private readonly _element: HTMLElement) {
        super();
    }

    onRenderObject(): void {
        
        const style = this._element.style;
        const size = this.entity.size;
        const pos = this.entity.position;

        const boundsHalfWidth = Viewport.size.x / 2;
        const boundsHalfHeight = Viewport.size.y / 2;

        // Change coordinate system
        const correctedX = boundsHalfWidth + pos.x;
        const correctedY = -(pos.y - boundsHalfHeight);

        // Adjust for size
        const left = correctedX - size.x / 2;
        const top = correctedY - size.y / 2;

        style.left = `${left}px`;
        style.top = `${top}px`;
    }
}
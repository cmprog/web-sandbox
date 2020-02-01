import { Entity } from "./Entity.js";
import { Vector2 } from "../Drawing/Vector.js";

export class Renderer {

    constructor(private readonly _entity: Entity, private readonly _element: HTMLElement) {}

    bounds: Vector2;

    update(): void {
        
        const style = this._element.style;
        const size = this._entity.size;
        const pos = this._entity.position;

        const boundsHalfWidth = this.bounds.x / 2;
        const boundsHalfHeight = this.bounds.y / 2;

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
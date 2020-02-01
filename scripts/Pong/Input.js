import { Vector2 } from "../Drawing/Vector.js";
import { PhysicsGame } from "./PhysicsGame.js";
export class Viewport {
    static initialize() {
        if (Viewport._isInitialized) {
            console.warn('Input is already initialized.');
            return;
        }
        this.size.x = window.innerWidth;
        this.size.y = window.innerHeight;
        window.addEventListener('resize', Viewport._onResize);
        Viewport._isInitialized = true;
    }
    static _onResize(e) {
        Viewport.size.x = window.innerWidth;
        Viewport.size.y = window.innerHeight;
        PhysicsGame.broadcastMessage('onViewportSizeChanged');
    }
    /**
     * Converts the window x-coordinate to Viewport coordinates.
     * @param windowX The window x-coordinate.
     */
    static toViewportX(windowX) {
        return windowX - (Viewport.size.x / 2);
    }
    /**
     * Converts the window y-coordinate to Viewport coordinates.
     * @param windowY The window y-coordinate.
     */
    static toViewportY(windowY) {
        return -(windowY - (Viewport.size.y / 2));
    }
}
Viewport._isInitialized = false;
Viewport.size = new Vector2(0, 0);
export class Input {
    static initialize() {
        if (Input._isInitialized) {
            console.warn('Input is already initialized.');
            return;
        }
        // Handling all mouse events to better handle touch interfaces
        document.addEventListener('mousedown', Input._onMouseEvent);
        document.addEventListener('mousemove', Input._onMouseEvent);
        document.addEventListener('mouseup', Input._onMouseEvent);
        document.addEventListener('touchmove', Input._onTouchEvent);
        Input._isInitialized = true;
    }
    static _onTouchEvent(e) {
        if (e.touches.length) {
            const primaryTouch = e.touches[0];
            Input.mousePosition.x = Viewport.toViewportX(primaryTouch.clientX);
            Input.mousePosition.y = Viewport.toViewportY(primaryTouch.clientY);
        }
    }
    static _onMouseEvent(e) {
        Input.mousePosition.x = Viewport.toViewportX(e.clientX);
        Input.mousePosition.y = Viewport.toViewportY(e.clientY);
    }
}
Input._isInitialized = false;
Input.mousePosition = new Vector2(0, 0);

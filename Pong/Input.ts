import { Vector2 } from "../Drawing/Vector.js";
import { PhysicsGame } from "./PhysicsGame.js";

export class Viewport {

    private static _isInitialized = false;

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
    
    private static _onResize(e: UIEvent): void {
        Viewport.size.x = window.innerWidth;
        Viewport.size.y = window.innerHeight;
        PhysicsGame.broadcastMessage('onViewportSizeChanged');
    }

    static readonly size = new Vector2(0, 0);

    /**
     * Converts the window x-coordinate to Viewport coordinates.
     * @param windowX The window x-coordinate.
     */
    static toViewportX(windowX: number): number {
        return windowX - (Viewport.size.x / 2);
    }

    /**
     * Converts the window y-coordinate to Viewport coordinates.
     * @param windowY The window y-coordinate.
     */
    static toViewportY(windowY: number): number {
        return -(windowY - (Viewport.size.y / 2));
    }
}

export class Input {
    
    private static _isInitialized = false;
    
    static readonly mousePosition = new Vector2(0, 0);

    static initialize() {        
        if (Input._isInitialized) {
            console.warn('Input is already initialized.');
            return;
        }

        // Handling all mouse events to better handle touch interfaces
        document.addEventListener('mousedown', Input._onMouseEvent);
        document.addEventListener('mousemove', Input._onMouseEvent);
        document.addEventListener('mouseup', Input._onMouseEvent);

        Input._isInitialized = true;
    }

    private static _onMouseEvent(e: MouseEvent) {        
        Input.mousePosition.x = Viewport.toViewportX(e.clientX);
        Input.mousePosition.y = Viewport.toViewportY(e.clientY);
    }
}
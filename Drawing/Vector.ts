export class Vector2 {
    constructor(public x: number, public y: number) {

    }

    get magnitude(): number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    scale(s: number) {
        this.x *= s;
        this.y *= s;
    }

    add(v: Vector2) {
        this.x += v.x;
        this.y += v.y;
    }

    normalize(): void {
        if ((this.x == 0) && (this.y == 0)) return;
        const mag = this.magnitude;
        this.x /= mag;
        this.y /= mag;
    }

    static createNormalized(x: number, y: number): Vector2 {
        const v = new Vector2(x, y);
        v.normalize();
        return v;
    }
}
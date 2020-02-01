export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get magnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    scale(s) {
        this.x *= s;
        this.y *= s;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
    normalize() {
        if ((this.x == 0) && (this.y == 0))
            return;
        const mag = this.magnitude;
        this.x /= mag;
        this.y /= mag;
    }
    static createNormalized(x, y) {
        const v = new Vector2(x, y);
        v.normalize();
        return v;
    }
}

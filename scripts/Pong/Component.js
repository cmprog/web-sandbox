export class Component {
    get entity() {
        return this._entity;
    }
    set entity(v) {
        if (this._entity) {
            console.warn('Component entity should generally not change once set.');
        }
        this._entity = v;
    }
    get tags() {
        return this.entity.tags;
    }
}

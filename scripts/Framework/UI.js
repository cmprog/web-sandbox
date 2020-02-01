export class UI {
    static query(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Failed to find element using selector '${selector}'.`);
        }
        return element;
    }
    static removeAllChildren(node) {
        while (node.lastChild) {
            node.removeChild(node.lastChild);
        }
    }
}

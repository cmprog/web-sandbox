export class UI {

    static query<TElement extends Element>(selector: string): TElement {
        const element = document.querySelector<TElement>(selector);

        if (!element) {
            console.warn(`Failed to find element using selector '${selector}'.`);
        }

        return element;
    }

    static removeAllChildren(node: Node) {
        while (node.lastChild) {
            node.removeChild(node.lastChild);
        }
    }
}
import { Property } from "./Property.js";
import { NumberFormatter, Formatters } from './Formatters.js';
import { UI } from "./UI.js";
import { Collection, CollectionChangedEventArgs, CollectionChangedAction } from "./Collection.js";
import { DualProgressBar, ProgressBar } from "../Beez/Controls.js";

/**
 * Extended configuration we attach to DOM elements.
 */
export class ElementConfig {    
    
    bindings: Array<any> = [];
    control: any = null;
    
    /**
     * Gets or creates and attaches the config for the element.
     * @param element The DOM element.
     */
    static fromElement(element: Element): ElementConfig {
        const el = <any>element;

        if (!el.gameConfig) {
            el.gameConfig = new ElementConfig();
        }

        return el.gameConfig;
    }
}

export interface CommandAction {
    () : void;
}

export class CommandBinding {

    constructor(private readonly _element: HTMLElement, private readonly _action: CommandAction) {
        this._element.addEventListener('click', this._onClick.bind(this));
    }

    private _onClick() {
        this._action();
    }

    static attach(element: HTMLElement, action: CommandAction): CommandBinding {
        
        const binding = new CommandBinding(element, action);
        const config = ElementConfig.fromElement(element);
        config.bindings.push(binding);
        return binding;
    }
}

/**
 * Binds the value of a boolean property to whether or not the selected
 * element should have a given class name.
 */
export class ElementClassBinding {
    
    constructor(
        private readonly _element: HTMLElement,
        private readonly _property: Property<boolean>,
        private readonly _className: string) {

        this._property.valueChanged.add(this._onValueChanged.bind(this));
        this._onValueChanged();
    }

    private _onValueChanged() {
        if (this._property.value) {
            this._element.classList.add(this._className);
        } else {
            this._element.classList.remove(this._className);
        }
    }

    static attach(element: HTMLElement, property: Property<boolean>, className: string): ElementClassBinding {
        
        const binding = new ElementClassBinding(element, property, className);

        const config = ElementConfig.fromElement(element);
        config.bindings.push(binding);

        return binding;
    }
}

export class PropertyBinding {

    private _formatter: NumberFormatter = null;
    private _actualFormatter: NumberFormatter = Formatters.Fixed_2;
    private _textNode: Text;

    constructor(private readonly _element: HTMLElement, private readonly _property: Property) {
        
        this._textNode = document.createTextNode(this._getValueText());
        UI.removeAllChildren(this._element);
        this._element.appendChild(this._textNode);

        this._property.valueChanged.add(this._onValueChanged.bind(this));
    }

    get formatter(): NumberFormatter {
        return this._formatter;        
    }

    set formatter(f: NumberFormatter) {
        this._formatter = f;
        this._actualFormatter = f || Formatters.Fixed_2;
        this._updateValue();
    }

    private _updateValue() {
        this._textNode.textContent = this._getValueText();
    }

    private _onValueChanged() {
        this._updateValue();
    }

    private _getValueText() {
        return this._actualFormatter.toString(this._property.value);
    }

    static attach(element: HTMLElement, property: Property, formatter: NumberFormatter = null): PropertyBinding {
        
        const binding = new PropertyBinding(element, property);
        
        if (formatter) {
            binding.formatter = formatter;
        }

        const config = ElementConfig.fromElement(element);
        config.bindings.push(binding);

        return binding;
    }
}

export class TemplateContext {

    static createDefault(): TemplateContext {
        return new TemplateContext(document.body);
    }

    constructor(private readonly _element: HTMLElement) {

    }

    private _query(selector: string): HTMLElement {

        if (!selector) {
            return this._element;
        }

        const childElement = this._element.querySelector<HTMLElement>(selector);
        if (!childElement) {
            console.debug(`Failed to find template component ${selector}.`);
        }
        return childElement;
    }

    bindCommand(selector: string, action: CommandAction): CommandBinding {
        const childElement = this._element.querySelector<HTMLElement>(selector);
        if (childElement) {
            return CommandBinding.attach(childElement, action);
        }

        return null;
    }

    propertyBinding(selector: string, property: Property, formatter: NumberFormatter) {
        const childElement = this._element.querySelector<HTMLElement>(selector);
        if (childElement) {
            PropertyBinding.attach(childElement, property, formatter);
        }
    }

    progressBar(selector: string, value: Property, maximum: Property) {
        const childElement = this._query(selector);
        if (childElement) {
            return ProgressBar.attach(childElement, value, maximum);
        }
        
        return null;
    }

    dualProgressBar(selector: string, primary: Property, secondary: Property, capacity: Property): DualProgressBar {
        const childElement = this._query(selector);
        if (childElement) {
            return DualProgressBar.attach(childElement, primary, secondary, capacity);
        }

        return null;
    }

    classBinding(selector: string, flag: Property<boolean>, className: string): ElementClassBinding {
        const childElement = this._query(selector);
        if (childElement) {
            return ElementClassBinding.attach(childElement, flag, className);
        }

        return null;
    }

    bindCollection<TComponent>(selector: string, source: Collection<TComponent>, templateElement: HTMLElement): CollectionTemplateBinding<TComponent> {
        const childElement = this._query(selector);
        if (childElement) {
            return CollectionTemplateBinding.attach(childElement, source, templateElement);
        }

        return null;
    }
}

export interface TemplateComponent {
    attachTemplateBindings(context: TemplateContext);
}

export class CollectionTemplateBinding<TComponent> {

    constructor(
        private readonly _containerElement: HTMLElement,
        private readonly _componentSource: Collection<TComponent>,
        private readonly _componentTemplate: Element) {

        this._componentSource.changed.add(this._componentSourceChanged.bind(this));
        this._onCollectionReset();
    }

    private _componentSourceChanged(source: Collection<TComponent>, e: CollectionChangedEventArgs<TComponent>) {

        switch (e.action) {

            case CollectionChangedAction.Add: {

                const element = this._createComponentElement(e.item);

                if (this._containerElement.children.length == e.index) {
                    this._containerElement.appendChild(element);
                } else if (e.index < this._containerElement.children.length) {
                    this._containerElement.insertBefore(element, this._containerElement.children[e.index]);
                } else {
                    console.warn('Collection changed event does not match element state.');
                    this._onCollectionReset();
                }
                
                break;
            }

            case CollectionChangedAction.Remove: {

                const child = this._containerElement.children[e.index];

                if (child) {
                    this._containerElement.removeChild(child);
                } else {
                    console.warn('Collection changed event does not match element state.');
                    this._onCollectionReset();
                }

                break;
            }

            default:
                console.warn('Unknown collection changed action.');
                this._onCollectionReset();
                break;
        }
    }

    private _createComponentElement(component: TComponent): HTMLElement {

        const element = <HTMLElement> this._componentTemplate.cloneNode(true);

        if (this._isTemplateComponent(component)) {
            const context = new TemplateContext(element);
            component.attachTemplateBindings(context);
        }

        return element;
    }

    private _onCollectionReset() {
        
        UI.removeAllChildren(this._containerElement);

        for (const component of this._componentSource) {
            const element = this._createComponentElement(component);
            this._containerElement.appendChild(element);
        }
    }

    private _isTemplateComponent(component: any): component is TemplateComponent {
        return (component as TemplateComponent).attachTemplateBindings !== undefined;
    }

    static attach<TComponent>(container: HTMLElement, componentSource: Collection<TComponent>, componentTemplate: HTMLElement): CollectionTemplateBinding<TComponent> {
        
        const binding = new CollectionTemplateBinding(container, componentSource, componentTemplate);

        const config = ElementConfig.fromElement(container);
        config.bindings.push(binding);
        return binding;
    }
}
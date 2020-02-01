import { Formatters } from './Formatters.js';
import { UI } from "./UI.js";
import { CollectionChangedAction } from "./Collection.js";
import { DualProgressBar, ProgressBar } from "../Beez/Controls.js";
/**
 * Extended configuration we attach to DOM elements.
 */
export class ElementConfig {
    constructor() {
        this.bindings = [];
        this.control = null;
    }
    /**
     * Gets or creates and attaches the config for the element.
     * @param element The DOM element.
     */
    static fromElement(element) {
        const el = element;
        if (!el.gameConfig) {
            el.gameConfig = new ElementConfig();
        }
        return el.gameConfig;
    }
}
export class CommandBinding {
    constructor(_element, _action) {
        this._element = _element;
        this._action = _action;
        this._element.addEventListener('click', this._onClick.bind(this));
    }
    _onClick() {
        this._action();
    }
    static attach(element, action) {
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
    constructor(_element, _property, _className) {
        this._element = _element;
        this._property = _property;
        this._className = _className;
        this._property.valueChanged.add(this._onValueChanged.bind(this));
        this._onValueChanged();
    }
    _onValueChanged() {
        if (this._property.value) {
            this._element.classList.add(this._className);
        }
        else {
            this._element.classList.remove(this._className);
        }
    }
    static attach(element, property, className) {
        const binding = new ElementClassBinding(element, property, className);
        const config = ElementConfig.fromElement(element);
        config.bindings.push(binding);
        return binding;
    }
}
export class PropertyBinding {
    constructor(_element, _property) {
        this._element = _element;
        this._property = _property;
        this._formatter = null;
        this._actualFormatter = Formatters.Fixed_2;
        this._textNode = document.createTextNode(this._getValueText());
        UI.removeAllChildren(this._element);
        this._element.appendChild(this._textNode);
        this._property.valueChanged.add(this._onValueChanged.bind(this));
    }
    get formatter() {
        return this._formatter;
    }
    set formatter(f) {
        this._formatter = f;
        this._actualFormatter = f || Formatters.Fixed_2;
        this._updateValue();
    }
    _updateValue() {
        this._textNode.textContent = this._getValueText();
    }
    _onValueChanged() {
        this._updateValue();
    }
    _getValueText() {
        return this._actualFormatter.toString(this._property.value);
    }
    static attach(element, property, formatter = null) {
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
    constructor(_element) {
        this._element = _element;
    }
    static createDefault() {
        return new TemplateContext(document.body);
    }
    _query(selector) {
        if (!selector) {
            return this._element;
        }
        const childElement = this._element.querySelector(selector);
        if (!childElement) {
            console.debug(`Failed to find template component ${selector}.`);
        }
        return childElement;
    }
    bindCommand(selector, action) {
        const childElement = this._element.querySelector(selector);
        if (childElement) {
            return CommandBinding.attach(childElement, action);
        }
        return null;
    }
    propertyBinding(selector, property, formatter) {
        const childElement = this._element.querySelector(selector);
        if (childElement) {
            PropertyBinding.attach(childElement, property, formatter);
        }
    }
    progressBar(selector, value, maximum) {
        const childElement = this._query(selector);
        if (childElement) {
            return ProgressBar.attach(childElement, value, maximum);
        }
        return null;
    }
    dualProgressBar(selector, primary, secondary, capacity) {
        const childElement = this._query(selector);
        if (childElement) {
            return DualProgressBar.attach(childElement, primary, secondary, capacity);
        }
        return null;
    }
    classBinding(selector, flag, className) {
        const childElement = this._query(selector);
        if (childElement) {
            return ElementClassBinding.attach(childElement, flag, className);
        }
        return null;
    }
    bindCollection(selector, source, templateElement) {
        const childElement = this._query(selector);
        if (childElement) {
            return CollectionTemplateBinding.attach(childElement, source, templateElement);
        }
        return null;
    }
}
export class CollectionTemplateBinding {
    constructor(_containerElement, _componentSource, _componentTemplate) {
        this._containerElement = _containerElement;
        this._componentSource = _componentSource;
        this._componentTemplate = _componentTemplate;
        this._componentSource.changed.add(this._componentSourceChanged.bind(this));
        this._onCollectionReset();
    }
    _componentSourceChanged(source, e) {
        switch (e.action) {
            case CollectionChangedAction.Add: {
                const element = this._createComponentElement(e.item);
                if (this._containerElement.children.length == e.index) {
                    this._containerElement.appendChild(element);
                }
                else if (e.index < this._containerElement.children.length) {
                    this._containerElement.insertBefore(element, this._containerElement.children[e.index]);
                }
                else {
                    console.warn('Collection changed event does not match element state.');
                    this._onCollectionReset();
                }
                break;
            }
            case CollectionChangedAction.Remove: {
                const child = this._containerElement.children[e.index];
                if (child) {
                    this._containerElement.removeChild(child);
                }
                else {
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
    _createComponentElement(component) {
        const element = this._componentTemplate.cloneNode(true);
        if (this._isTemplateComponent(component)) {
            const context = new TemplateContext(element);
            component.attachTemplateBindings(context);
        }
        return element;
    }
    _onCollectionReset() {
        UI.removeAllChildren(this._containerElement);
        for (const component of this._componentSource) {
            const element = this._createComponentElement(component);
            this._containerElement.appendChild(element);
        }
    }
    _isTemplateComponent(component) {
        return component.attachTemplateBindings !== undefined;
    }
    static attach(container, componentSource, componentTemplate) {
        const binding = new CollectionTemplateBinding(container, componentSource, componentTemplate);
        const config = ElementConfig.fromElement(container);
        config.bindings.push(binding);
        return binding;
    }
}

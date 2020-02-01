import { UI } from '../Framework/UI.js';
import { PropertyBinding, CommandBinding, CollectionTemplateBinding, TemplateContext } from '../Framework/Bindings.js';
import { Formatters } from '../Framework/Formatters.js';
import { Game } from '../Framework/Game.js';
import { State } from './State.js';

export class BeeGame extends Game {

    private readonly _state: State;

    constructor() {
        super();

        this._state = new State(this);

        this.register(this._state.hive.createForagerGenerator());
        this.register(this._state.hive);
        
        const templateContext = TemplateContext.createDefault();
        this._state.extractor.attachTemplateBindings(templateContext);
        this._state.honeyHouse.attachTemplateBindings(templateContext);
        this._state.beeKeeper.attachTemplateBindings(templateContext);        

        CollectionTemplateBinding.attach(UI.query('.actions'), this._state.actions, UI.query('#templates > .timed-action'));
        CollectionTemplateBinding.attach(UI.query('.hive .supers'), this._state.hive.supers, UI.query('#templates > .hive-super'));
        CollectionTemplateBinding.attach(UI.query('.bee-keeper .supers'), this._state.beeKeeper.supers, UI.query('#templates > .keeper-super'));
        CollectionTemplateBinding.attach(UI.query('.honey-house .supers'), this._state.honeyHouse.supers, UI.query('#templates > .house-super'));
        CollectionTemplateBinding.attach(UI.query('.extractor .supers'), this._state.extractor.supers, UI.query('#templates > .extractor-super'));
       
        PropertyBinding.attach(UI.query('.foragers .value'), this._state.hive.foragerCount, Formatters.Fixed_0);
        PropertyBinding.attach(UI.query('.workers .value'), this._state.hive.workerCount, Formatters.Fixed_0);
        PropertyBinding.attach(UI.query('.bee-capacity .value'), this._state.hive.beeCapacity, Formatters.Fixed_0);
        
        PropertyBinding.attach(UI.query('.time-total .value'), this._state.time.totalTimeS, Formatters.Fixed_2);
        PropertyBinding.attach(UI.query('.tick-time .value'), this._state.time.tickTimeS, Formatters.Fixed_2);
        PropertyBinding.attach(UI.query('.tick-count .value'), this._state.time.totalTickCount, Formatters.Fixed_2);

        CommandBinding.attach(UI.query('.add-super'), this._state.hive.addSuper.bind(this._state.hive));
    }
}
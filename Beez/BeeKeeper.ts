import { Property } from "../Framework/Property.js";
import { Collection } from "../Framework/Collection.js";
import { HiveSuper } from "./Hive.js";
import { TemplateComponent, TemplateContext } from "../Framework/Bindings.js";

export class BeeKeeper implements TemplateComponent {
    
    readonly superCapacity = new Property(3);
    readonly supers = new Collection<HiveSuper>();

    /**
     * The number of ticks it takes to collect a super from a hive.
     */
    readonly collectionSpeed = new Property(5);

    /**
     * The number of ticks it takes to load a super from either the beekeeper
     * or the honey house to the extractor.
     */
    readonly extractorLoadingSpeed = new Property(5);

    /**
     * The number of ticks it takes to move a super from the bee keeper
     * to the honey house.
     */
    readonly storeSuperSpeed = new Property(5);

    attachTemplateBindings(context: TemplateContext) {
        
    }
}
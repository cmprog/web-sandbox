import { Property } from "../Framework/Property.js";
import { Collection } from "../Framework/Collection.js";
export class BeeKeeper {
    constructor() {
        this.superCapacity = new Property(3);
        this.supers = new Collection();
        /**
         * The number of ticks it takes to collect a super from a hive.
         */
        this.collectionSpeed = new Property(5);
        /**
         * The number of ticks it takes to load a super from either the beekeeper
         * or the honey house to the extractor.
         */
        this.extractorLoadingSpeed = new Property(5);
        /**
         * The number of ticks it takes to move a super from the bee keeper
         * to the honey house.
         */
        this.storeSuperSpeed = new Property(5);
    }
    attachTemplateBindings(context) {
    }
}

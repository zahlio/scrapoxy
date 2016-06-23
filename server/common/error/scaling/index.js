'use strict';


module.exports = class ScalingError {
    constructor(askedInstances, security) {
        this.askedInstances = askedInstances;
        this.security = security;
    }

    toString() {
        if (this.security) {
            return `Scrapoxy configuration doesn't allow to start ${this.askedInstances} more instances`;
        }

        return `Maximum number of instances reached (cannot start ${this.askedInstances} more instances)`;
    }
};

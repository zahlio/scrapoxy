/**
 * UNUSED
 */

'use strict';

const _ = require('lodash'),
    Promise = require('bluebird'),
    winston = require('winston');


module.exports = class ProviderMultiple {
    constructor(providers) {
        this.name = 'multiple';

        this._providers = providers;
        this._providersMap = _.indexBy(this._providers, 'name');
    }


    get models() {
        return Promise
            .map(this._providers, (provider) => provider.models)
            .then((models) => _.flatten(models));
    }


    createInstances(count) {
        winston.debug('[ProviderMultiple] createInstances: count=%d', count);

        const part = Math.ceil(count / this._providers.length),
            promises = [];

        let remaining = count,
            i = 0;

        while (remaining > 0) {
            const provider = this._providers[i];

            if (part <= remaining) {
                promises.push(provider.createInstances(part));
                remaining -= part;
            }
            else {
                promises.push(provider.createInstances(remaining));
                remaining = 0;
            }

            ++i;
        }

        return Promise.all(promises);
    }


    startInstance(model) {
        winston.debug('[ProviderMultiple] startInstance: model=', model.toString());

        const provider = this._providersMap[model.type];
        if (!provider) {
            throw new Error(`Unknown type: ${model.type}`);
        }

        return provider.startInstance(model);
    }


    removeInstance(model) {
        winston.debug('[ProviderMultiple] removeInstance: model=', model.toString());

        const provider = this._providersMap[model.type];
        if (!provider) {
            throw new Error(`Unknown type: ${model.type}`);
        }

        return provider.removeInstance(model);
    }
};


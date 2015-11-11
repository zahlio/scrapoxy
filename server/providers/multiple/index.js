/**
 * UNUSED
 */

'use strict';

var _ = require('lodash'),
    Promise = require('bluebird'),
    winston = require('winston');


module.exports = ProviderMultiple;


////////////

function ProviderMultiple(providers) {
    this.name = 'multiple';

    this._providers = providers;
    this._providersMap = _.indexBy(this._providers, 'name');
}


ProviderMultiple.prototype.getModels = function getModelsFn() {
    winston.debug('[ProviderMultiple] getModels');

    return Promise.map(this._providers, function(provider) {
        return provider.getModels();
    })
        .then(function (models) {
            return _.flatten(models);
        });
};


ProviderMultiple.prototype.createInstances = function createInstancesFn(count) {
    winston.debug('[ProviderMultiple] createInstances: count=%d', count);

    var part = Math.ceil(count / this._providers.length),
        remaining = count,
        i = 0,
        promises = [];

    while (remaining > 0) {
        var provider = this._providers[i];

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
};


ProviderMultiple.prototype.startInstance = function startInstanceFn(model) {
    winston.debug('[ProviderMultiple] startInstance: model=', model.toString());

    var provider = this._providersMap[model.getType()];
    if (!provider) {
        throw new Error('Unknown type: ' + model.getType());
    }

    return provider.startInstance(model);
};


ProviderMultiple.prototype.deleteInstance = function deleteInstanceFn(model) {
    winston.debug('[ProviderMultiple] deleteInstance: model=', model.toString());

    var provider = this._providersMap[model.getType()];
    if (!provider) {
        throw new Error('Unknown type: ' + model.getType());
    }

    return provider.deleteInstance(model);
};


ProviderMultiple.prototype.deleteInstances = function deleteInstancesFn(models) {
    winston.debug('[ProviderMultiple] deleteInstances: models=', _.map(models, function (model) {
        return model.toString();
    }));

    if (models.length <= 0) {
        return;
    }

    var byProvider = _.groupBy(models, '_type');

    var promises = [];
    this._providers.forEach(function(provider) {
        var models = byProvider[provider.name];
        if (models && models.length > 0) {
            promises.push(provider.deleteInstances(models));
        }
    });

    return Promise.all(promises)
        .then(function (results) {
            return _.flatten(results);
        });
};

/**
 * UNUSED
 */

'use strict';

var _ = require('lodash'),
    Promise = require('bluebird'),
    winston = require('winston');


module.exports = CloudMultiple;


////////////

function CloudMultiple(clouds) {
    this.name = 'multiple';

    this._clouds = clouds;
    this._cloudsMap = _.indexBy(this._clouds, 'name');
}


CloudMultiple.prototype.getModels = function getModelsFn() {
    winston.debug('[CloudMultiple] getModels');

    return Promise.map(this._clouds, function(cloud) {
        return cloud.getModels();
    })
        .then(function (models) {
            return _.flatten(models);
        });
};


CloudMultiple.prototype.createInstances = function createInstancesFn(count) {
    winston.debug('[CloudMultiple] createInstances: count=%d', count);

    var part = Math.ceil(count / this._clouds.length),
        remaining = count,
        i = 0,
        promises = [];

    while (remaining > 0) {
        var cloud = this._clouds[i];

        if (part <= remaining) {
            promises.push(cloud.createInstances(part));
            remaining -= part;
        }
        else {
            promises.push(cloud.createInstances(remaining));
            remaining = 0;
        }

        ++i;
    }

    return Promise.all(promises);
};


CloudMultiple.prototype.startInstance = function startInstanceFn(model) {
    winston.debug('[CloudMultiple] startInstance: model=', model.toString());

    var cloud = this._cloudsMap[model.getType()];
    if (!cloud) {
        throw new Error('Unknown type: ' + model.getType());
    }

    return cloud.startInstance(model);
};


CloudMultiple.prototype.deleteInstance = function deleteInstanceFn(model) {
    winston.debug('[CloudMultiple] deleteInstance: model=', model.toString());

    var cloud = this._cloudsMap[model.getType()];
    if (!cloud) {
        throw new Error('Unknown type: ' + model.getType());
    }

    return cloud.deleteInstance(model);
};


CloudMultiple.prototype.deleteInstances = function deleteInstancesFn(models) {
    winston.debug('[CloudMultiple] deleteInstances: models=', _.map(models, function (model) {
        return model.toString();
    }));

    if (models.length <= 0) {
        return;
    }

    var byCloud = _.groupBy(models, '_type');

    var promises = [];
    this._clouds.forEach(function(cloud) {
        var models = byCloud[cloud.name];
        if (models && models.length > 0) {
            promises.push(cloud.deleteInstances(models));
        }
    });

    return Promise.all(promises)
        .then(function (results) {
            return _.flatten(results);
        });
};

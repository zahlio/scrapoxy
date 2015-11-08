'use strict';

var _ = require('lodash'),
    Promise = require('bluebird'),
    AWS = require('aws-sdk'),
    InstanceModel = require('../../proxies/manager/instance.model'),
    winston = require('winston');


module.exports = CloudEC2;


////////////

function CloudEC2(config, instancePort) {
    if (!config || !instancePort) {
        throw new Error('[CloudEC2] should be instanced with config and instancePort');
    }

    this._config = config;
    this._instancePort = instancePort;

    this.name = 'awsec2';

    var opts = _.pick(this._config, ['accessKeyId', 'secretAccessKey', 'region']);
    this._ec2 = new AWS.EC2(opts);
}


CloudEC2.ST_PENDING = "pending";
CloudEC2.ST_RUNNING = "running";
CloudEC2.ST_SHUTTING_DOWN = "shutting-down";
CloudEC2.ST_TERMINATED = "terminated";
CloudEC2.ST_STOPPING = "stopping";
CloudEC2.ST_STOPPED = "stopped";


CloudEC2.prototype.getModels = function getModelsFn() {
    var self = this;

    winston.debug('[CloudEC2] getModels');

    return describeInstances()
        .then(summarizeInfo)
        .then(excludeTerminated)
        .then(excludeOutscope)
        .then(convertToModel);


    ////////////


    function describeInstances() {
        return new Promise(function(resolve, reject) {
            self._ec2.describeInstances({}, function(err, data) {
                if (err) return reject(err);

                var instances = _(data.Reservations)
                    .pluck('Instances')
                    .flatten()
                    .value();

                resolve(instances);
            });
        });
    }

    function summarizeInfo(instancesDesc) {
        return _.map(instancesDesc, function(instanceDesc) {
            return {
                id: instanceDesc.InstanceId,
                status: instanceDesc.State.Name,
                ip: instanceDesc.PublicIpAddress,
                tag: getTag(instanceDesc),
                toString: function toStringFn() {
                    return '(id=' + this.id + ' / status=' + this.status + ' / ip=' + this.ip + ' / tag=' + this.tag + ')';
                },
            };
        });

        ////////////

        function getTag(instanceDesc) {
            if (!instanceDesc.Tags) {
                return;
            }

            var first = _(instanceDesc.Tags)
                .filter(function(tag) { return tag.Key === 'Name'; })
                .first();

            if (!first) {
                return;
            }

            return first.Value;
        }
    }

    function excludeTerminated(instancesDesc) {
        return _.filter(instancesDesc, function(instanceDesc) {
            return instanceDesc.status !== CloudEC2.ST_TERMINATED &&
                instanceDesc.status !== CloudEC2.ST_SHUTTING_DOWN;
        });
    }

    function excludeOutscope(instancesDesc) {
        return _.filter(instancesDesc, function(instanceDesc) {
            return instanceDesc.tag && instanceDesc.tag.indexOf(self._config.tag) == 0;
        });
    }

    function convertToModel(instancesDesc) {
        return _.map(instancesDesc, function(instanceDesc) {
            return new InstanceModel(
                instanceDesc.id,
                self.name,
                convertStatus(instanceDesc.status),
                buildAddress(instanceDesc.ip),
                instanceDesc
            );
        });


        ////////////

        function buildAddress(ip) {
            if (!ip) {
                return;
            }

            return {
                hostname: ip,
                port: self._instancePort,
            };
        }

        function convertStatus(status) {
            switch (status) {
                case CloudEC2.ST_PENDING: {
                    return InstanceModel.STARTING;
                }
                case CloudEC2.ST_RUNNING: {
                    return InstanceModel.STARTED;
                }
                case CloudEC2.ST_STOPPED: {
                    return InstanceModel.STOPPED;
                }
                case CloudEC2.ST_STOPPING: {
                    return InstanceModel.STOPPING;
                }
                default: {
                    winston.error('[CloudEC2] Unknown status: ', status);
                    return InstanceModel.ERROR;
                }
            }
        }
    }
};


CloudEC2.prototype.createInstances = function createInstancesFn(count) {
    var self = this;

    winston.debug('[CloudEC2] createInstances: count=%d', count);

    return new Promise(function(resolve, reject) {
        self._ec2.describeInstances({}, function(err, data) {
            if (err) return reject(err);

            var actualCount = _(data.Reservations)
                .pluck('Instances')
                .flatten()
                .filter(function(instance) {
                    return instance.State.Name !== CloudEC2.ST_SHUTTING_DOWN
                        && instance.State.Name !== CloudEC2.ST_TERMINATED
                })
                .size();

            winston.debug('[CloudEC2] createInstances: actualCount=%d', actualCount);

            if (actualCount + count > self._config.maxRunningInstances) {
                return reject(new Error('[CloudEC2] createInstances: Cannot start instances (limit reach): ' + actualCount + ' + ' + count + ' > ' + self._config.maxRunningInstances));
            }

            var params = _.assign({}, self._config.instance, {
                MinCount: count,
                MaxCount: count,
                InstanceInitiatedShutdownBehavior: 'terminate',
                Monitoring: {
                    Enabled: false
                },
            });

            self._ec2.runInstances(params, function(err, data) {
                if (err) return reject(err);

                var ids = _.pluck(data.Instances, 'InstanceId');

                // Need to add some delay because EC2 API is not so fast!
                setTimeout(function() {
                    var params = {
                        Resources: ids,
                        Tags: [{
                            'Key': 'Name',
                            'Value': self._config.tag,
                        }],
                    };

                    self._ec2.createTags(params, function(err) {
                        if (err) return reject(err);

                        resolve();
                    });
                }, 500);
            });
        });
    });
};


CloudEC2.prototype.startInstance = function startInstanceFn(model) {
    var self = this;

    winston.debug('[CloudEC2] startInstance: model=', model.toString());

    return new Promise(function(resolve, reject) {
        var params = {
            'InstanceIds': [model.getCloudOpts().id],
        };

        self._ec2.startInstances(params, function (err) {
            if (err) return reject(err);

            resolve();
        });
    });
};


CloudEC2.prototype.deleteInstance = function deleteInstanceFn(model) {
    var self = this;

    winston.debug('[CloudEC2] deleteInstance: model=', model.toString());

    return new Promise(function(resolve, reject) {
        var params = {
            'InstanceIds': [model.getCloudOpts().id],
        };

        self._ec2.terminateInstances(params, function (err) {
            if (err) return reject(err);

            resolve();
        });
    });
};


CloudEC2.prototype.deleteInstances = function deleteInstancesFn(models) {
    var self = this;

    winston.debug('[CloudEC2] deleteInstances: models=', _.map(models, function(model) {return model.toString(); }));

    if (models.length <= 0) {
        return;
    }

    return new Promise(function(resolve, reject) {
        var params = {
            'InstanceIds': _.map(models, function (model) {
                return model.getCloudOpts().id;
            }),
        };

        self._ec2.terminateInstances(params, function (err) {
            if (err) return reject(err);

            resolve();
        });
    });
};

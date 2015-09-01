'use strict';


var _ = require('lodash'),
    Promise = require('bluebird'),
    Instance = require('./instance'),
    winston = require('winston');


module.exports = ProxiesManager;


/////////

function ProxiesManager(config, cloud) {
    this._config = config;
    this._cloud = cloud;

    this._managedInstances = {};
    this._aliveInstances = [];
    this._aliveInstancesMap = {};

    this._domains = {};

    this._requiredCount = this._config.scaling.min;
}


ProxiesManager.prototype.getInstances = function getInstances() {
    return _.values(this._managedInstances);
};


ProxiesManager.prototype.getAliveInstances = function getAliveInstancesFn() {
    return this._aliveInstances;
};


ProxiesManager.prototype.waitForAliveInstances = function waitForAliveInstancesFn(count) {
    var self = this;

    winston.debug('[ProxiesManager] waitForAliveInstances: count=%d', count);

    if (self._aliveInstances.length === count) {
        return Promise.resolve();
    }
    else {
        return Promise.delay(2000)
            .then(function() {
                return self.waitForAliveInstances(count);
            });
    }
};


ProxiesManager.prototype.start = function startFn() {
    var self = this;

    winston.info('[ProxiesManager] start');

    self._checkIntervalTimeout = setInterval(checkInstances, self._config.checkDelay);


    ////////////

    function checkInstances() {
        winston.debug('[ProxiesManager] checkInstances');

        self._cloud.getModels()
            .then(updateInstances)
            .then(adjustInstances)
            .catch(function(err) {
                winston.error('[ProxiesManager] error: ', err);
            });


        ////////////

        function updateInstances(models) {
            var existingNames = _.keys(self._managedInstances);

            models.forEach(function(model) {
                var name = model.getName();

                var instance = self._managedInstances[name];
                if (instance) {
                    // Modify
                    instance.setModel(model);

                    var idx = existingNames.indexOf(name);
                    if (idx >= 0) {
                        existingNames.splice(idx, 1);
                    }
                }
                else {
                    // Add
                    winston.debug('[ProxiesManager] checkInstances: add: ', model.toString());

                    instance = new Instance(self, self._cloud, self._config);
                    self._managedInstances[name] = instance;

                    registerEvents(instance);

                    instance.setModel(model);
                }
            });

            // Remove
            existingNames.forEach(function(name) {
                var instance = self._managedInstances[name];

                winston.debug('[ProxiesManager] checkInstances: remove: ', instance.getModel().toString());

                delete self._managedInstances[name];

                instance.removedFromManager();
            });
        }

        function registerEvents(instance) {
            instance.on('alive:changed', function(alive) {
                var name = instance.getName();
                if (alive) {
                    self._aliveInstances.push(instance);
                    self._aliveInstancesMap[name] = instance;
                }
                else {
                    var idx = self._aliveInstances.indexOf(instance);
                    if (idx >= 0) {
                        self._aliveInstances.splice(idx, 1);
                    }

                    delete self._aliveInstancesMap[name];
                }
            });
        }

        function adjustInstances() {
            var managedCount = Object.keys(self._managedInstances).length;
            winston.debug('[ProxiesManager] adjustInstances: required:%d / actual:%d', self._requiredCount, managedCount);

            if (managedCount > self._requiredCount) {
                // Too much
                var count = managedCount - self._requiredCount;

                winston.info('[ProxiesManager] adjustInstances: remove %d instances', count);

                var models = _(self._managedInstances)
                    .values()
                    .takeRight(count)
                    .map(function(instance) { return instance.getModel(); })
                    .value();

                return self._cloud.deleteInstances(models);
            }
            else if (managedCount < self._requiredCount) {
                // Not enough
                var count = self._requiredCount - managedCount;

                winston.info('[ProxiesManager] adjustInstances: add %d instances', count);

                return self._cloud.createInstances(count);
            }
        }
    }
};


/**
 * For testing purpose
 */
ProxiesManager.prototype.crashRandomInstance = function crashRandomInstanceFn() {
    var names = _.keys(this._managedInstances);

    var randomName = names[Math.floor(Math.random() * names.length)];

    winston.debug('[ProxiesManager] crashRandomInstance: name=%s', randomName);

    var instance = this._managedInstances[randomName];

    return this._cloud.deleteInstances([instance.getModel()]);
};


ProxiesManager.prototype.stop = function stopFn() {
    var self = this;

    winston.info('[ProxiesManager] stop');

    self._requiredCount = 0;

    return waitForNoInstance()
        .then(function() {
            if (self._checkIntervalTimeout) {
                clearInterval(self._checkIntervalTimeout);
            }
        });


    ////////////

    function waitForNoInstance() {
        return new Promise(function(resolve, reject) {
            checkNoInstance();


            ////////////

            function checkNoInstance() {
                var managedCount = Object.keys(self._managedInstances).length;
                if (managedCount <= 0) {
                    resolve();
                }
                else {
                    setTimeout(checkNoInstance, self._config.checkDelay);
                }
            }
        });
    }
};


ProxiesManager.prototype.getNextRunningInstanceForDomain = function getNextRunningInstanceForDomainFn(domain, forceName) {
    var self = this;

    if (self._aliveInstances.length <= 0) {
        return;
    }

    domain = domain || '';

    var nextInstance;
    if (forceName) {
        nextInstance = self._aliveInstancesMap[forceName];
    }

    if (!nextInstance) {
        var actualInstance = self._domains[domain];

        nextInstance = getNextRunningInstance(actualInstance);
    }

    self._domains[domain] = nextInstance;

    return nextInstance;


    ////////////

    function getNextRunningInstance(instance) {
        if (self._aliveInstances.length <= 0) {
            return;
        }

        var idx;
        if (instance) {
            idx = self._aliveInstances.indexOf(instance);
            if (idx >= 0) {
                ++idx;
                if (idx >= self._aliveInstances.length) {
                    idx = 0;
                }
            }
            else {
                idx = 0;
            }
        }
        else {
            idx = 0;
        }

        if (idx >= self._aliveInstances.length) {
            return;
        }

        return self._aliveInstances[idx];
    }
};


ProxiesManager.prototype.getStats = function getStatsFn() {
    winston.debug('[ProxiesManager] getStats');

    return _.map(this._managedInstances, function(instance) {
        return instance.getStats();
    });
};


ProxiesManager.prototype.requestReceived = function requestReceivedFn() {
    var self = this;

    if (self._requiredCount <= 0) {
        // Shutdown
        return;
    }

    self._requiredCount = self._config.scaling.max;

    if (self._scaleDownTimeout) {
        clearTimeout(self._scaleDownTimeout);
    }

    self._scaleDownTimeout = setTimeout(function() {
        self._requiredCount = self._config.scaling.min;
    }, self._config.scaling.downscaleDelay);
};


ProxiesManager.prototype.stopInstance = function stopInstanceFn(name) {
    var instance = this._managedInstances[name];
    if (!instance) {
        return;
    }

    instance.emit('alive:changed', false);

    return instance.stop();
};
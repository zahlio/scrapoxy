'use strict';


var _ = require('lodash'),
    EventEmitter = require('events').EventEmitter,
    InstanceModel = require('./instance.model'),
    pinger = require('../../common/pinger'),
    util = require('util'),
    useragent = require('./useragent'),
    winston = require('winston');



module.exports = Instance;


////////////

function Instance(manager, stats, cloud, config) {
    var self = this;

    EventEmitter.call(self);

    self._manager = manager;
    self._stats = stats;
    self._cloud = cloud;
    self._config = config;

    self._model = null;
    self._alive = false;
    self._aliveCount = void 0;
    self._rqCount = 0;


    // Register event
    self.on('status:updated', function(newstatus) {
        // Alive
        if (newstatus === InstanceModel.STARTED) {
            // Start monitor
            winston.debug('[Instance/%s] checkAlive every %d secs', self._model.getName(), self._config.checkAliveDelay);
            self._checkAliveTimeout = setInterval(checkAlive, self._config.checkAliveDelay);

            var delay = Math.floor(self._config.autorestart.minDelay +  Math.random() * (self._config.autorestart.maxDelay - self._config.autorestart.minDelay));
            winston.debug('[Instance/%s] autorestart in %d secs', self._model.getName(), delay);
            self._checkRestartTimeout = setTimeout(autorestart, delay);

            // Set useragent
            self._useragent = useragent.generateBrowser();
            //self._useragent = useragent.generateBot();
        }
        else {
            // Stop monitor
            if (self._checkAliveTimeout) {
                clearInterval(self._checkAliveTimeout);
                self._checkAliveTimeout = void 0;
            }

            if (self._checkRestartTimeout) {
                clearTimeout(self._checkRestartTimeout);
                self._checkRestartTimeout = void 0;
            }

            // Unset useragent
            self._useragent = void 0;

            // Set alive status
            self._changeAlive(false);
        }

        // Error
        if (newstatus === InstanceModel.ERROR) {
            self._cloud.stopInstance(self._model)
                .catch(function(err) {
                    winston.error('[Instance/%s] error: ', self._model.getName(), err);
                });
        }

        // Restart if stopped
        if (newstatus === InstanceModel.STOPPED) {
            self._cloud.startInstance(self._model)
                .catch(function(err) {
                    winston.error('[Instance/%s] error: ', self._model.getName(), err);
                });
        }
    });

    // Crash
    self.on('alive:updated', function(alive) {
        if (!alive) {
            self._stats.addRqCount(self._rqCount);
            self._rqCount = 0;
        }
        if (alive) {
            if (self._checkStopIfCrashedTimeout) {
                clearTimeout(self._checkStopIfCrashedTimeout);
                self._checkStopIfCrashedTimeout = void 0;
            }
        }
        else {
            self._checkStopIfCrashedTimeout = setTimeout(stopIfCrashed, self._config.stopIfCrashedDelay);
        }
    });


    ////////////

    function checkAlive() {
        winston.debug('[Instance/%s] checkAlive: %s / %s', self._model.getName(), self._alive, (self._aliveCount ? self._aliveCount : '-'));

        pinger.ping(self._model.getAddress())
            .then(function() {
                self._changeAlive(true);
                self._aliveCount = void 0;
            })
            .catch(function() {
                changeAlive(false);

                if (self._aliveCount) {
                    --self._aliveCount;
                }
                else {
                    self._aliveCount = self._config.aliveMax;
                }

                if (self._aliveCount <= 0) {
                    self._aliveCount = void 0;

                    self.stop()
                        .catch(function(err) {
                            winston.error('[Instance/%s] error: ', self._model.getName(), err);
                        });
                }
                self._changeAlive(false);
            });
    }

    function autorestart() {
        winston.debug('[Instance/%s] autorestart', self._model.getName());

        if (self._model.hasStatus(InstanceModel.STARTED)) {
            if (self._manager.getAliveInstances().length > 1) {
                winston.debug('[Instance/%s] autorestart => cancelled (only 1 instance)', self._model.getName());

                self.stop()
                    .catch(function(err) {
                        winston.error('[Instance/%s] error: ', self._model.getName(), err);
                    });
            }
            else {
                var delay = Math.floor(self._config.autorestart.minDelay +  Math.random() * (self._config.autorestart.maxDelay - self._config.autorestart.minDelay));

                winston.debug('[Instance/%s] autorestarting in %d secs...', self._model.getName(), delay);

                self._checkRestartTimeout = setTimeout(autorestart, delay);
            }
        }
    }

    function stopIfCrashed() {
        winston.debug('[Instance/%s] stopIfCrashed', self._model.getName());

        if (self._model.hasStatus(InstanceModel.STARTED)) {
            self.stop()
                .catch(function(err) {
                    winston.error('[Instance/%s] error: ', self._model.getName(), err);
                });
        }
    }
}
util.inherits(Instance, EventEmitter);


Instance.prototype.getName = function getNameFn() {
    return this._model.getName();
};


Instance.prototype.getModel = function getModelFn() {
    return this._model;
};


Instance.prototype.getProxyParameters = function getProxyParametersFn() {
    var address = this._model.getAddress();

    return {
        'hostname': address.hostname,
        'port': address.port,
        'username': this._config.username,
        'password': this._config.password,
    };
};


Instance.prototype.setModel = function setModelFn(model) {
    var oldstatus = this._model ? this._model.getStatus() : void 0;

    this._model = model;

    if (!this._model.hasStatus(oldstatus)) {
        this.emit('status:updated', this._model.getStatus(), oldstatus);
    }
};

Instance.prototype._changeAlive = function _changeAliveFn(alive) {
    winston.debug('[Instance/%s] changeAlive: %s => %s', this._model.getName(), this._alive, alive);

    if (this._alive !== alive) {
        this._alive = alive;

        this.emit('alive:updated', alive);
    }
};


Instance.prototype.removedFromManager = function removedFromManagerFn() {
    this._model.setStatus(InstanceModel.REMOVED);

    this.emit('status:updated', InstanceModel.REMOVED, this._model.getStatus());
};


Instance.prototype.stop = function stopFn() {
    this._changeAlive(false);

    return this._cloud.stopInstance(this._model);
};


Instance.prototype.getStats = function getStatsFn() {
    return _.assign(this._model.getStats(), {
        alive: this._alive,
        useragent: this._useragent,
    });
};


Instance.prototype.updateHeaders = function updateHeadersFn(req) {
    req.headers['user-agent'] = this._useragent;

    delete req.headers['x-cache-proxyname'];
};


Instance.prototype.incrRequest = function incrRequestFn() {
    ++this._rqCount;
};


Instance.prototype.toString = function toStringFn() {
    return this._model.toString();
};

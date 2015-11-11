'use strict';

var _ = require('lodash'),
    Promise = require('bluebird'),
    child_process = require('child_process'),
    InstanceModel = require('../../proxies/manager/instance.model'),
    winston = require('winston');


module.exports = ProviderLocal;


////////////

function ProviderLocal(proxyPath) {
    if (!proxyPath) {
        throw new Error('[ProviderLocal] should be instanced with proxyPath');
    }

    this._proxyPath = proxyPath;

    this.name = 'local';

    this._portIncr = 0;

    this._locals = {};
}


ProviderLocal.prototype.getModels = function getModelsFn() {
    var self = this;

    winston.debug('[ProviderLocal] getInstances');

    return new Promise(function(resolve, reject) {
        var models = _(self._locals)
            .values()
            .map(function(local) {
                var address = {
                    hostname: 'localhost',
                    port: local.port,
                };

                return new InstanceModel(
                    local.name,
                    self.name,
                    InstanceModel.STARTED,
                    address,
                    local
                );
            })
            .value();

        resolve(models);
    });
};


ProviderLocal.prototype.createInstances = function createInstancesFn(count) {
    var self = this;

    winston.debug('[ProviderLocal] createInstances: count=%d', count);

    return createLocals(count)
        .map(function(local) {
            return self._startInstance(local)
                .then(function(local) {
                    self._locals[local.name] = local;
                });
        });


    ////////////

    function createLocals(count) {
        return new Promise(function(resolve, reject) {
            var locals = [];
            for (var i = 0; i < count; ++i) {
                var port = self._getNextPort();

                var local = {
                    port: port,
                    name: 'proxy' + port,
                    toString: function() { return this.name + '@localhost:' + this.port; }
                };

                locals.push(local);
            }

            resolve(locals);
        });
    }
};


ProviderLocal.prototype.startInstance = function startInstanceFn(model) {
    winston.debug('[ProviderLocal] startInstance: model=', model.toString());

    var local = model.getProviderOpts();
    if (local.child) {
        throw new Error('Cannot start a started instance');
    }

    local.port = this._getNextPort();

    var newaddress = {
        hostname: 'localhost',
        port: local.port,
    };
    model.setAddress(newaddress);

    return this._startInstance(local);
};


ProviderLocal.prototype.deleteInstance = function deleteInstanceFn(model) {
    winston.debug('[ProviderLocal] deleteInstance: model=', model.toString());

    return new Promise(function(resolve, reject) {
        var local = model.getProviderOpts();
        if (!local.child || local.child.killed) {
            resolve();
        }

        local.child.on('close', function() {
            resolve();
        });

        local.child.kill();
        local.child = void 0;
    });
};


ProviderLocal.prototype.deleteInstances = function deleteInstancesFn(models) {
    var self = this;

    winston.debug('[ProviderLocal] deleteInstances: models=', _.map(models, function (model) { return model.toString();}));

    return Promise.map(models, function(model) {
        delete self._locals[model.getProviderOpts().name];

        return self.deleteInstance(model);
    });
};


ProviderLocal.prototype._startInstance = function _startInstanceFn(local) {
    var self = this;

    winston.debug('[ProviderLocal] _startInstance: local=%s', local.toString());

    return new Promise(function(resolve, reject) {
        var child = child_process.exec('node ' + self._proxyPath + ' ' + local.name + ' ' + local.port);
        child.stdout.on('data', function(data) {
            winston.debug('[ProviderLocal/%s] (stdout) %s', local.name, data);
        });

        child.stderr.on('data', function(data) {
            winston.debug('[ProviderLocal/%s] (stderr) %s', local.name, data);
        });

        child.on('close', function() {
            winston.debug('[ProviderLocal/%s] Close', local.name);
        });

        local.child = child;

        resolve(local);
    });
};


ProviderLocal.prototype._getNextPort = function _getNextPortFn() {
    var port = this._portIncr;

    ++this._portIncr;
    if (this._portIncr > 1000) {
        this._portIncr = 0;
    }

    return 30000 + port;
};

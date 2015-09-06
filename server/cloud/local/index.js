'use strict';

var _ = require('lodash'),
    Promise = require('bluebird'),
    child_process = require('child_process'),
    InstanceModel = require('../../proxies/manager/instance.model'),
    winston = require('winston');


module.exports = CloudLocal;


////////////

function CloudLocal(proxyPath) {
    if (!proxyPath) {
        throw new Error('[CloudLocal] should be instanced with proxyPath');
    }

    this._proxyPath = proxyPath;

    this._portIncr = 0;

    this._locals = {};
}


CloudLocal.prototype.getModels = function getModelsFn() {
    var self = this;

    winston.debug('[CloudLocal] getInstances');

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
                    'local',
                    InstanceModel.STARTED,
                    address,
                    local
                );
            })
            .value();

        resolve(models);
    });
};


CloudLocal.prototype.createInstances = function createInstancesFn(count) {
    var self = this;

    winston.debug('[CloudLocal] createInstances: count=%d', count);

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


CloudLocal.prototype.startInstance = function startInstanceFn(model) {
    winston.debug('[CloudLocal] startInstance: model=', model.toString());

    var local = model.getCloudOpts();
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


CloudLocal.prototype.stopInstance = function stopInstanceFn(model) {
    winston.debug('[CloudLocal] stopInstance: model=', model.toString());

    return new Promise(function(resolve, reject) {
        var local = model.getCloudOpts();
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


CloudLocal.prototype.deleteInstances = function deleteInstancesFn(models) {
    var self = this;

    winston.debug('[CloudLocal] deleteInstances: models=', _.map(models, function (model) { return model.toString();}));

    return Promise.map(models, function(model) {
        delete self._locals[model.getCloudOpts().name];

        return self.stopInstance(model);
    });
};


CloudLocal.prototype._startInstance = function _startInstanceFn(local) {
    var self = this;

    winston.debug('[CloudLocal] _startInstance: local=%s', local.toString());

    return new Promise(function(resolve, reject) {
        var child = child_process.exec('node ' + self._proxyPath + ' ' + local.name + ' ' + local.port);
        child.stdout.on('data', function(data) {
            winston.debug('[CloudLocal/%s] (stdout) %s', local.name, data);
        });

        child.stderr.on('data', function(data) {
            winston.debug('[CloudLocal/%s] (stderr) %s', local.name, data);
        });

        child.on('close', function() {
            winston.debug('[CloudLocal/%s] Close', local.name);
        });

        local.child = child;

        resolve(local);
    });
};


CloudLocal.prototype._getNextPort = function _getNextPortFn() {
    var port = this._portIncr;

    ++this._portIncr;
    if (this._portIncr > 1000) {
        this._portIncr = 0;
    }

    return 30000 + port;
};

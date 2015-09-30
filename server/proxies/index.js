'use strict';

var Promise = require('bluebird'),
    Commander = require('./commander'),
    Manager = require('./manager'),
    Master = require('./master'),
    Stats = require('./stats'),
    winston = require('winston');


module.exports = Main;


////////////

function Main(config, cloud) {
    this._config = config;
    this._cloud = cloud;

    // Stats
    this._stats = new Stats(this._config.stats);

    // Init Manager
    this._manager = new Manager(this._config.instance, this._stats, this._cloud);

    // Init Master
    this._master = new Master(this._config.proxy, this._manager, this._stats);

    // Init Commander
    this._commander = new Commander(this._config, this._manager, this._stats);
}


Main.prototype.getManager = function getManagerFn() {
    return this._manager;
};


Main.prototype.listen = function listenFn() {
    var self = this;

    winston.debug('[Main] listen');

    // Start Commander
    return self._commander.listen()
        .then(function () {
            // Start Manager
            self._manager.start();

            // Start Master
            return self._master.listen();
        });
};


Main.prototype.listenAndWait = function listenAndWaitFn() {
    var self = this;

    winston.debug('[Main] listenAndWait');

    return self.listen()
        .then(function () {
            return self._manager.waitForAliveInstances(self._config.instance.scaling.min);
        });
};


Main.prototype.shutdown = function shutdownFn() {
    winston.debug('[Main] shutdown');

    this._master.shutdown();
    this._commander.shutdown();

    return this._manager.stop();
};

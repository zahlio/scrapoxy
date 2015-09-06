'use strict';

var Promise = require('bluebird'),
    auth = require('./auth'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    cors = require('cors'),
    errorHandler = require('errorhandler'),
    express = require('express'),
    http = require('http'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    socketIO = require('socket.io'),
    winston = require('winston');


module.exports = Commander;


////////////

function Commander(config, manager) {
    this._config = config;

    // Init Express
    var app = express();

    // Set config
    app.set('config', this._config);

    // Init Express modules
    app.use(morgan('combined'));
    app.use(cors());
    app.use(compression());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json({type: 'application/json',}));
    app.use(methodOverride());
    app.use(errorHandler());

    // Init Express routes
    app.use('/config', auth, require('./config')(manager));
    app.use('/instances', auth, require('./instances')(manager));
    app.use('/scaling', auth, require('./scaling')(manager));

    // Socket I.O
    this._httpServer = http.Server(app);
    var io = socketIO(this._httpServer);

    registerEvents(manager);


    ////////////

    function registerEvents(manager) {
        manager.on('status:updated', function (stats) {
            var payload = JSON.stringify({
                event: 'status:updated',
                payload: stats,
            });

            io.emit('event', payload);
        });

        manager.on('alive:updated', function (stats) {
            var payload = JSON.stringify({
                event: 'alive:updated',
                payload: stats,
            });

            io.emit('event', payload);
        });

        manager.on('config:updated', function (config) {
            var payload = JSON.stringify({
                event: 'config:updated',
                payload: config,
            });

            io.emit('event', payload);
        });

        manager.on('scaling:updated', function (scaling) {
            var payload = JSON.stringify({
                event: 'scaling:updated',
                payload: scaling,
            });

            io.emit('event', payload);
        });
    }
}

Commander.prototype.listen = function listenFn() {
    var self = this;

    winston.info('[Commander] listen: port=%d', self._config.commander.port);

    return new Promise(function (resolve, reject) {
        // Start server
        self._server = self._httpServer.listen(self._config.commander.port, function (err) {
            if (err) return reject(new Error('[Commander] Cannot listen at port ' + self._config.commander.port + ': ' + err.toString()));

            resolve();
        });
    })
};

Commander.prototype.shutdown = function shutdownFn() {
    this._server.close();
};

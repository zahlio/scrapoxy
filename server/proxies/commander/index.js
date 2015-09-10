'use strict';

var Promise = require('bluebird'),
    Auth = require('./auth'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    cors = require('cors'),
    errorHandler = require('errorhandler'),
    express = require('express'),
    http = require('http'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    path = require('path'),
    socketIO = require('socket.io'),
    winston = require('winston');


module.exports = Commander;


////////////

function Commander(config, manager, master) {
    this._config = config;

    // Auth
    var auth = new Auth(this._config.commander.password);

    // Init Express
    var app = express();

    // Init Express modules
    app.use(morgan('combined'));
    app.use(cors());
    app.use(compression());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json({type: 'application/json',}));
    app.use(methodOverride());
    app.use(errorHandler());

    // Init Express routes
    function expressAuth(req, res, next) {
        return auth.express(req, res, next);
    }

    app.use('/api/config', expressAuth, require('./api/config')(this._config, manager));
    app.use('/api/instances', expressAuth, require('./api/instances')(manager));
    app.use('/api/scaling', expressAuth, require('./api/scaling')(this._config, manager));
    app.use(express.static(path.join(__dirname, 'public')));

    // Socket I.O
    this._httpServer = http.Server(app);
    var io = socketIO(this._httpServer);
    io.use(function(socket, next) {
        return auth.socketio(socket, next);
    });

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

        master.on('stats', function (stats) {
            var payload = JSON.stringify({
                event: 'stats',
                payload: stats,
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

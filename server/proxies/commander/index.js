'use strict';

var Promise = require('bluebird'),
    auth = require('./auth'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    cors = require('cors'),
    errorHandler = require('errorhandler'),
    express = require('express'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    winston = require('winston');


module.exports = Commander;


////////////

function Commander(config, manager) {
    this._config = config;

    // Init Express
    this._app = express();

    // Set config
    this._app.set('config', config);

    // Init Express modules
    this._app.use(morgan('combined'));
    this._app.use(cors());
    this._app.use(compression());
    this._app.use(bodyParser.urlencoded({extended: false}));
    this._app.use(bodyParser.json({type: 'application/json',}));
    this._app.use(methodOverride());
    this._app.use(errorHandler());

    // Init Express routes
    this._app.use('/commands', auth, require('./commands')(manager));
    this._app.use('/stats', auth, require('./stats')(manager));
}

Commander.prototype.listen = function listenFn() {
    var self = this;

    winston.info('[Commander] listen: port=%d', self._config.port);

    return new Promise(function(resolve, reject) {
        // Start server
        self._server = self._app.listen(self._config.port, function(err) {
            if (err) return reject(new Error('[Commander] Cannot listen at port ' + self._config.port + ': ' + err.toString()));

            resolve();
        });
    })
};

Commander.prototype.shutdown = function shutdownFn() {
    this._server.close();
};

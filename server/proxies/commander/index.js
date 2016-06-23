'use strict';

const Promise = require('bluebird'),
    Auth = require('./auth'),
    bodyParser = require('koa-bodyparser'),
    compress = require('koa-compress'),
    cors = require('kcors'),
    errorHandler = require('koa-error'),
    http = require('http'),
    Koa = require('koa'),
    logger = require('koa-logger'),
    path = require('path'),
    Router = require('koa-router'),
    serve = require('koa-static'),
    socketIO = require('socket.io'),
    winston = require('winston');


module.exports = class Commander {
    constructor(config, manager, stats) {
        this._config = config;


        // Configure KOA framework
        const app = new Koa();
        app.name = 'Scrapoxy';

        if (winston.level === 'debug') {
            app.use(logger());
        }

        app.use(errorHandler());
        app.use(cors());
        app.use(compress());
        app.use(bodyParser());

        // Serve frontend
        app.use(serve(path.join(__dirname, 'public')));

        // Auth
        const auth = new Auth(this._config.commander.password);

        function *koaAuth(next) {
            yield auth.koa(this, next);
        }

        // Define routes
        const router = new Router();
        router.use('/api/config', koaAuth, require('./api/config')(this._config, manager));
        router.use('/api/instances', koaAuth, require('./api/instances')(manager));
        router.use('/api/scaling', koaAuth, require('./api/scaling')(this._config, manager));
        router.use('/api/stats', koaAuth, require('./api/stats')(stats));
        app.use(router.routes());


        // Socket I.O
        this._httpServer = http.Server(app.callback());
        const io = socketIO(this._httpServer);
        io.use((socket, next) => auth.socketio(socket, next));

        manager.on('status:updated', (evStats) => {
            const payload = JSON.stringify({
                event: 'status:updated',
                payload: evStats,
            });

            io.emit('event', payload);
        });

        manager.on('alive:updated', (evStats) => {
            const payload = JSON.stringify({
                event: 'alive:updated',
                payload: evStats,
            });

            io.emit('event', payload);
        });

        manager.on('config:updated', (evConfig) => {
            const payload = JSON.stringify({
                event: 'config:updated',
                payload: evConfig,
            });

            io.emit('event', payload);
        });

        manager.on('scaling:updated', (evScaling) => {
            const payload = JSON.stringify({
                event: 'scaling:updated',
                payload: evScaling,
            });

            io.emit('event', payload);
        });

        manager.on('scaling:error', (evScaling) => {
            const payload = JSON.stringify({
                event: 'scaling:error',
                payload: evScaling.toString(),
            });

            io.emit('event', payload);
        });

        stats.on('stats', (evStats) => {
            const payload = JSON.stringify({
                event: 'stats',
                payload: evStats,
            });

            io.emit('event', payload);
        });
    }


    listen() {
        return new Promise((resolve, reject) => {
            // Start server
            this._server = this._httpServer.listen(this._config.commander.port, (err) => {
                if (err) {
                    return reject(
                        new Error(`[Commander] Cannot listen at port ${this._config.commander.port}:${err.toString()}`)
                    );
                }

                winston.info('GUI is available at http://localhost:%d', this._config.commander.port);

                resolve();
            });
        });
    }


    shutdown() {
        this._server.close();
    }
};

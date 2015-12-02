'use strict';

const Promise = require('bluebird'),
    errorHandler = require('koa-error'),
    Koa = require('koa'),
    Router = require('koa-router'),
    winston = require('winston');


module.exports = class TestServer {
    constructor(port) {
        this._port = port;

        const counter = new Map();
        let num = 0;

        this._app = new Koa();
        this._app.name = 'Test Server';
        this._app.use(errorHandler());

        const router = new Router();
        router.get('/', processGET);
        router.post('/', processPOST);
        router.put('/', processPUT);
        this._app.use(router.routes());


        ////////////

        function *processGET() {
            winston.debug('[TestServer:%d/GET] %s %s', num++, this.request.method, this.request.url);

            this.request.headers['remote-address'] = this.request.req.connection.remoteAddress;

            this.status = 200;
            this.body = JSON.stringify(this.request.headers);
        }

        function *processPOST() {
            winston.debug('[TestServer:%d/POST] %s %s', num++, this.request.method, this.request.url);

            const name = this.request.headers['x-cache-proxyname'] || this.request.req.connection.remoteAddress;

            const count = (counter.get(name) || 0) + 1;
            counter.set(name, count);

            this.status = count <= 2 ? 200 : 503;
            this.body = count.toString();
        }

        function *processPUT() {
            winston.debug('[TestServer:%d/PUT] %s %s', num++, this.request.method, this.request.url);

            const name = this.request.headers['x-cache-proxyname'] || this.request.req.connection.remoteAddress;

            const count = (counter.get(name) || 0) + 1;
            counter.set(name, count);

            const max = 7500;
            let discard;
            if (count < max) {
                if (Math.random() * (count / max) > 0.7) {
                    discard = true;
                }
                else {
                    discard = false;
                }
            }
            else {
                discard = true;
            }

            this.status = discard ? 503 : 200;
        }
    }

    listen() {
        return new Promise((resolve, reject) => {
            this._server = this._app.listen(this._port, (err) => {
                if (err) {
                    return reject(err);
                }

                winston.info('[TestServer] listen at port %d', this._port);

                resolve();
            });
        });
    }

    shutdown() {
        winston.info('[TestServer] shutdown');

        this._server.close();
    }
};

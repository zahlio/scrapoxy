'use strict';

const Promise = require('bluebird'),
    child_process = require('child_process'),
    winston = require('winston');


module.exports = class TestServer {
    constructor() {
        this._child = void 0;
    }

    start() {
        winston.debug('[TestServer] start');

        return new Promise((resolve) => {
            const child = child_process.exec('node ./e2e/test-server/server/index.js 13337');
            child.stdout.on(
                'data',
                (data) => winston.debug('[TestServer] (stdout) %s', data)
            );

            child.stderr.on(
                'data',
                (data) => winston.debug('[TestServer] (stderr) %s', data)
            );

            child.on(
                'close',
                () => winston.debug('[TestServer] Close')
            );

            this._child = child;

            resolve(child);
        });
    }

    stop() {
        winston.debug('[TestServer] stop');

        return new Promise((resolve) => {
            if (!this._child || this._child.killed) {
                resolve();
            }

            this._child.on('close', () => resolve());

            this._child.kill();
            this._child = void 0;
        });
    }
};

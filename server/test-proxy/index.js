'use strict';

const Promise = require('bluebird'),
    request = require('request');


module.exports = class TestProxy {
    constructor(proxyUrl) {
        this._proxyUrl = proxyUrl;

        this._count = new Map();
    }


    request() {
        const opts = {
            url: 'http://api.ipify.org',
            proxy: this._proxyUrl,
        };

        return new Promise((resolve, reject) => {
            request(opts, (err, response, body) => {
                if (err) {
                    return reject(err);
                }

                if (response.statusCode !== 200) {
                    return reject(`${response.statusCode}: ${body}`);
                }

                this._count.set(body, (this._count.get(body) || 0) + 1);

                resolve();
            });
        });
    }


    get count() {
        return this._count;
    }


    get size() {
        return this._count.size;
    }
};

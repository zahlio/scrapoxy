'use strict';

const Promise = require('bluebird'),
    http = require('http'),
    querystring = require('querystring'),
    url = require('url'),
    winston = require('winston');


const agent = new http.Agent();


module.exports = {
    getWithProxy,
    postWithProxy,
    putWithProxy,
};


////////////

function getWithProxy(uri, proxy) {
    return new Promise((resolve, reject) => {
        const srvUrl = url.parse(uri);

        const opts = {
            hostname: proxy.hostname,
            port: proxy.port,
            method: 'GET',
            path: uri,
            agent,
            headers: {
                Host: srvUrl.host,
            },
        };

        addAuthToOptsIfNecessary(proxy, opts);

        const req = http.request(opts, (res) => {
            const chunks = [];

            res.on('error', (err) => reject(err));

            res.on('data', (chunk) => chunks.push(chunk));

            res.on('end', () => {
                res.body = Buffer.concat(chunks).toString();

                try {
                    res.json = JSON.parse(res.body);
                }
                catch (err) {
                    // Ignore
                }

                resolve(res);
            });
        });

        req.on('error', (err) => reject(err));

        req.end();
    });
}

function postWithProxy(uri, data, proxy) {
    return _postPutWithProxyImpl('POST', uri, data, proxy);
}

function putWithProxy(uri, data, proxy) {
    return _postPutWithProxyImpl('PUT', uri, data, proxy);
}

function _postPutWithProxyImpl(method, uri, data, proxy) {
    return new Promise((resolve, reject) => {
        const rawData = querystring.stringify(data);

        const srvUrl = url.parse(uri);

        const opts = {
            hostname: proxy.hostname,
            port: proxy.port,
            method,
            path: uri,
            agent,
            headers: {
                'Host': srvUrl.host,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(rawData),
            },
        };

        addAuthToOptsIfNecessary(proxy, opts);

        const req = http.request(opts, (res) => {
            const chunks = [];

            res.on('error', (err) => {
                winston.error('[SR] res error');

                reject(err);
            });

            res.on('data', (chunk) => chunks.push(chunk));

            res.on('end', () => {
                res.body = Buffer.concat(chunks).toString();

                try {
                    res.json = JSON.parse(res.body);
                }
                catch (err) {
                    // Ignore
                }

                resolve(res);
            });
        });

        req.on('error', (err) => {
            winston.error('[SR] req error');

            reject(err);
        });

        req.write(rawData);
        req.end();
    });
}

function addAuthToOptsIfNecessary(proxy, opts) {
    if (proxy.username && proxy.password) {
        const usernamePasswordB64 = new Buffer(`${proxy.username}:${proxy.password}`).toString('base64');
        opts.headers['Proxy-Authorization'] = new Buffer(`Basic ${usernamePasswordB64}`);
    }
}

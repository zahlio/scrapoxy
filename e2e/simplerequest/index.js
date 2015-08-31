'use strict';

var Promise = require('bluebird'),
    http = require('http'),
    querystring = require('querystring'),
    url = require('url');


var agent = new http.Agent();


module.exports = {
    getWithProxy: getWithProxy,
    postWithProxy: postWithProxy,
    putWithProxy: putWithProxy,
};


////////////

function getWithProxy(uri, proxy) {
    return new Promise(function(resolve, reject) {
        var srvUrl = url.parse(uri);

        var opts = {
            hostname: proxy.hostname,
            port: proxy.port,
            method: 'GET',
            path: uri,
            agent: agent,
            headers: {
                Host: srvUrl.host,
            }
        };

        addAuthToOptsIfNecessary(proxy, opts);

        var req = http.request(opts, function(res) {
            var chunks = [];

            res.setEncoding('utf8');

            res.on('error', function(err) {
                reject(err);
            });

            res.on('data', function(chunk) {
                chunks.push(chunk);
            });

            res.on('end', function() {
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

        req.on('error', function(err) {
            reject(err);
        });

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
    return new Promise(function(resolve, reject) {
        var rawData = querystring.stringify(data);

        var srvUrl = url.parse(uri);

        var opts = {
            hostname: proxy.hostname,
            port: proxy.port,
            method: method,
            path: uri,
            agent: agent,
            headers: {
                'Host': srvUrl.host,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(rawData),
            }
        };

        addAuthToOptsIfNecessary(proxy, opts);

        var req = http.request(opts, function(res) {
            var chunks = [];

            res.setEncoding('utf8');

            res.on('error', function(err) {
                console.log('[SR] res error');

                reject(err);
            });

            res.on('data', function(chunk) {
                chunks.push(chunk);
            });

            res.on('end', function() {
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

        req.on('error', function(err) {
            console.log('[SR] req error');

            reject(err);
        });

        req.write(rawData);
        req.end();
    });
}

function addAuthToOptsIfNecessary(proxy, opts) {
    if (proxy.username && proxy.password) {
        opts.headers['Proxy-Authorization'] = 'Basic ' + new Buffer(proxy.username + ':' + proxy.password).toString('base64');
    }
}
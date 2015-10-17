'use strict';

var _ = require('lodash'),
    Promise = require('bluebird'),
    domain = require('./domain'),
    http = require('http'),
    ProxyAgent = require('./proxy-agent'),
    url = require('url'),
    winston = require('winston');


module.exports = ProxiesMaster;


////////////

function ProxiesMaster(config, manager, stats) {
    var self = this;

    self._config = config;
    self._manager = manager;
    self._stats = stats;

    // Proxy Auth
    if (self._config.auth &&
        self._config.auth.username &&
        self._config.auth.password ) {
        self._.auth = 'Basic ' + new Buffer(self._config.auth.username + ':' + self._config.auth.password).toString('base64');
    }

    // HTTP Agent
    self._agent = new ProxyAgent({
        agent: new http.Agent(),
    });

    // Config server
    self._server = http.createServer();

    self._server.on('request', requestFn);


    ////////////

    function requestFn(req, res) {
        //winston.debug('[ProxiesMaster] request (%s) %s %s', req.connection.remoteAddress, req.method, req.url);

        // Check auth
        if (self._auth) {
            if (!req.headers['proxy-authorization'] || req.headers['proxy-authorization'] !== self._auth) {
                res.writeHead(407);
                return res.end('Wrong proxy credentials');
            }
        }

        // Log errors
        req.on('error', function(err) {
            winston.error('[ProxiesMaster] request (error client) %s %s => %s', req.method, req.url, err.toString());
        });

        res.on('error', function(err) {
            winston.error('[ProxiesMaster] request (error client) %s %s => %s', req.method, req.url, err.toString());
        });

        // Trigger scaling if necessary
        self._manager.requestReceived();


        // Get domain
        var uri = domain.convertHostnamePathToUri(req.hostname, req.url);
        var basedomain = domain.getBaseDomainForUri(uri);


        // Find instance
        var forceName = req.headers['x-cache-proxyname'],
            instance = self._manager.getNextRunningInstanceForDomain(basedomain, forceName);
            //instance = self._manager.getFirstInstance(forceName);

        if (!instance) {
            //winston.error('[ProxiesMaster] request: no running instance found');

            res.writeHead(407);
            return res.end('No running instance found');
        }


        // Update headers
        instance.updateHeaders(req);


        // Make request
        //winston.debug('[ProxiesMaster] makeRequest from %s: (%s) %s %s', instance.toString(), req.connection.remoteAddress, req.method, req.url);

        var proxyOpts = _.assign(createProxyOpts(req.url), {
            method: req.method,
            headers: req.headers,
            agent: self._agent,
            proxy: instance.getProxyParameters(),
        });

        var proxy_req = http.request(proxyOpts);

        proxy_req.on('error', function(err) {
            winston.error('[ProxiesMaster] request (error proxy) %s %s => %s', req.method, req.url, err.toString());

            res.writeHead(500);
            res.end('Error in proxy request: ' + err.toString());
        });

        // Start timer
        var start = process.hrtime();

        proxy_req.on('response', function(proxy_res) {
            proxy_res.on('error', function(err) {
                winston.error('[ProxiesMaster] response (error proxy) %s %s => %s', req.method, req.url, err.toString());

                res.writeHead(500);
                res.end('Error in proxy response: ' + err.toString());
            });

            proxy_res.on('end', function() {
                // Stop timer and record duration
                var duration = process.hrtime(start);

                self._stats.requestEnd(
                    duration,
                    proxy_res.socket._bytesDispatched,
                    proxy_res.socket.bytesRead
                );

                instance.incrRequest();
            });

            var headers = _.assign({}, proxy_res.headers, {
                'x-cache-proxyname': instance.getName(),
            });

            res.writeHead(proxy_res.statusCode, headers);

            proxy_res.pipe(res);
        });

        req.pipe(proxy_req);


        ////////////

        function createProxyOpts(target) {
            var opts = url.parse(target);

            opts = _.pick(opts, 'protocol', 'hostname', 'port', 'path');
            if (opts.protocol) {
                if (opts.protocol === 'https:') {
                    opts.ssl = true;
                }

                delete opts.protocol;
            }

            if (!opts.port) {
                opts.port = opts.ssl ? 443 : 80;
            }

            return opts;
        }
    }
}


ProxiesMaster.prototype.listen = function listenFn() {
    var self = this;

    return new Promise(function(resolve, reject) {
        self._server.listen(self._config.port, function(err) {
            if (err) return reject(new Error('[ProxiesMaster] Cannot listen at port ' + self._config.port + ': ' + err.toString()));

            winston.info('Proxy is listening at http://localhost:%d', self._config.port);

            return resolve();
        });
    });
};


ProxiesMaster.prototype.shutdown = function shutdownFn() {
    winston.debug('[ProxiesMaster] shutdown');

    this._server.close();
};

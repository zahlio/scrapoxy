'use strict';

const _ = require('lodash'),
    Promise = require('bluebird'),
    domain = require('./domain'),
    http = require('http'),
    ProxyAgent = require('./proxy-agent'),
    url = require('url'),
    winston = require('winston');


module.exports = class Master {
    constructor(config, manager, stats) {
        const self = this;

        self._config = config;
        self._manager = manager;
        self._stats = stats;

        // Proxy Auth
        if (self._config.auth &&
            self._config.auth.username &&
            self._config.auth.password) {
            winston.debug("[Master] Found credentials with username '%s'", self._config.auth.username);

            const usernamePasswordB64 = new Buffer(`${self._config.auth.username}:${self._config.auth.password}`).toString('base64');
            self._token = `Basic ${usernamePasswordB64}`;
        }

        // HTTP Agent
        self._agent = new ProxyAgent({
            agent: new http.Agent(),
        });

        // Config server
        self._server = http.createServer();

        self._server.on('request', request);


        ////////////

        function request(req, res) {
            // Check auth
            if (self._token) {
                if (!req.headers['proxy-authorization'] || req.headers['proxy-authorization'] !== self._token) {
                    res.writeHead(407, {
                        'Proxy-Authenticate': 'Basic realm="Scrapoxy"',
                        'Content-Type': 'text/plain',
                    });
                    return res.end('Wrong proxy credentials');
                }
            }

            // Log errors
            req.on('error',
                (err) => winston.error('[Master] request (error client) %s %s => %s', req.method, req.url, err.toString())
            );

            res.on('error',
                (err) => winston.error('[Master] request (error client) %s %s => %s', req.method, req.url, err.toString())
            );

            // Trigger scaling if necessary
            self._manager.requestReceived();

            // Get domain
            const uri = domain.convertHostnamePathToUri(req.hostname, req.url);
            const basedomain = domain.getBaseDomainForUri(uri);

            // Find instance
            const forceName = req.headers['x-cache-proxyname'],
                instance = self._manager.getNextRunningInstanceForDomain(basedomain, forceName);

            if (!instance) {
                res.writeHead(407);

                return res.end('No running instance found');
            }

            // Update headers
            instance.updateRequestHeaders(req.headers);

            // Make request
            const proxyOpts = _.merge(createProxyOpts(req.url), {
                method: req.method,
                headers: req.headers,
                agent: self._agent,
                proxy: instance.proxyParameters,
            });

            const proxy_req = http.request(proxyOpts);

            proxy_req.on('error', (err) => {
                winston.error('[Master] request (error proxy) %s %s => %s', req.method, req.url, err.toString());

                res.writeHead(500);
                res.end(`Error in proxy request: ${err.toString()}`);
            });

            // Start timer
            const start = process.hrtime();

            proxy_req.on('response', (proxy_res) => {
                proxy_res.on('error', (err) => {
                    winston.error('[Master] response (error proxy) %s %s => %s', req.method, req.url, err.toString());

                    res.writeHead(500);
                    res.end(`Error in proxy response: ${err.toString()}`);
                });

                proxy_res.on('end', () => {
                    // Stop timer and record duration
                    const duration = process.hrtime(start);

                    self._stats.requestEnd(
                        duration,
                        proxy_res.socket._bytesDispatched,
                        proxy_res.socket.bytesRead
                    );

                    instance.incrRequest();
                });

                instance.updateResponseHeaders(proxy_res.headers);

                res.writeHead(proxy_res.statusCode, proxy_res.headers);

                proxy_res.pipe(res);
            });

            req.pipe(proxy_req);


            ////////////

            function createProxyOpts(target) {
                let opts = url.parse(target);

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


    listen() {
        return new Promise((resolve, reject) => {
            this._server.listen(this._config.port, (err) => {
                if (err) {
                    return reject(new Error(`[Master] Cannot listen at port ${this._config.port} : ${err.toString()}`));
                }

                winston.info('Proxy is listening at http://localhost:%d', this._config.port);

                return resolve();
            });
        });
    }


    shutdown() {
        winston.debug('[Master] shutdown');

        this._server.close();
    }
};

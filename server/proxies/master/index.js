'use strict';

const _ = require('lodash'),
    Promise = require('bluebird'),
    domain = require('./domain'),
    http = require('http'),
    ProxyAgent = require('./proxy-agent'),
    sanitize = require('./sanitize'),
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
		
		self._server.on('connect', connect);
		
		// Accept client via CONNECT method
		function connect(req, socket, head){
			// Check auth
            if (self._token) {
                if (!req.headers['proxy-authorization'] || req.headers['proxy-authorization'] !== self._token) {
					winston.error('[Master] Error: Wrong proxy credentials for CONNECT method');
					socket.write('HTTP/1.1 407 Wrong proxy credentials for CONNECT method\r\n\r\n');
                    return socket.end();
                }
            }
			
			// Decrypt target
			parseTarget(req.url, (err, target) => {
				if (err) {
					winston.error('Error (parsing): ', err);
					return socket.end();
				}
				
				
				// Trigger scaling if necessary
				self._manager.requestReceived();
	
				// Get domain
				const uri = domain.convertHostnamePathToUri(target.hostname, target.url);
				const basedomain = domain.getBaseDomainForUri(uri);
	
				// Find instance
				const forceName = req.headers['x-cache-proxyname'],
					instance = self._manager.getNextRunningInstanceForDomain(basedomain, forceName);
	
				if (!instance) {
					winston.error('[Master] Error: No running instance found');
					socket.write('HTTP/1.1 500 Error: No running instance found\r\n\r\n');
                    return socket.end();
				}
				
				
				// Build Connect request for Instance
				const proxyOpts = {
					host: instance.proxyParameters.hostname,
					port: instance.proxyParameters.port,
					method: 'CONNECT',
					headers: req.headers, //Useless...
                	path: req.url
				};
				
				 // Update headers
           		instance.updateRequestHeaders(proxyOpts.headers);

				
				var proxy_connect_request = http.request(proxyOpts);
				
				// Start timer
            	const start = process.hrtime();
				
				proxy_connect_request.on('connect', function (routing_req, routing_socket, routing_head) {
					socket.on('error', (err) => {
						winston.error('Error (socket): ', err);
						routing_socket.end();
					});
			
					routing_socket.on('error', (err) => {
						winston.error('Error (routing_socket): ', err);
						socket.write('HTTP/1.1 500 Error (routing_socket): Target closed connection\r\n\r\n');
						socket.end();
					});
					socket.write('HTTP/1.1 200 Connection established\r\n\r\n');
					routing_socket.pipe(socket);
					socket.pipe(routing_socket);
				});
				
				socket.on('end', function () {
						// Stop timer and record duration when Tunnel connexion is closed
						const duration = process.hrtime(start);
						self._stats.requestEnd(
							duration,
							socket._bytesDispatched,
							socket.bytesRead
						);
						instance.incrRequest();
				});
				
				// Log errors
				proxy_connect_request.on('error',
					(err) => {
						winston.error('[Master] Error: request error from client (%s %s on instance %s):', req.method, req.url, instance.toString(), err);
						socket.write('HTTP/1.1 500 Error: request error from client\r\n\r\n');
					}
				);
			
				// End Connect Request
				proxy_connect_request.end();
				
				
			});
			
			function parseTarget(url, callback) {
				if (!url) return callback('No URL found');
			
				const part = url.split(':');
				if (part.length !== 2) {
					return callback(`Cannot parse target: ${url}`);
				}
			
				const hostname = part[0],
					port = parseInt(part[1]);
			
				if (!hostname || !port) {
					return callback(`Cannot parse target (2): ${url}`);
				}
			
				callback(null, {hostname, port});
			}
			
		}

        ////////////

        function request(req, res) { 

            // Check auth
            if (self._token) {
                if (!req.headers['proxy-authorization'] || req.headers['proxy-authorization'] !== self._token) {
                    res.writeHead(407, {
                        'Proxy-Authenticate': 'Basic realm="Scrapoxy"',
                        'Content-Type': 'text/plain',
                    });
                    return res.end('[Master] Error: Wrong proxy credentials');
                }
            }

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

                return res.end('[Master] Error: No running instance found');
            }

            // Log errors
            req.on('error',
                (err) => {
                    winston.error('[Master] Error: request error from client (%s %s on instance %s):', req.method, req.url, instance.toString(), err);
                }
            );

            res.on('error',
                (err) => {
                    winston.error('[Master] Error: response error from client (%s %s on instance %s):', req.method, req.url, instance.toString(), err);
                }
            );

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
                winston.error('[Master] Error: request error from target (%s %s on instance %s):', req.method, req.url, instance.toString(), err);

                res.writeHead(500);
                res.end(`[Master] Error: request error from target (${req.method} ${req.url} on instance ${instance.toString()}): ${err.toString()}`);
            });

            // Start timer
            const start = process.hrtime();

            proxy_req.on('response', (proxy_res) => {
                proxy_res.on('error', (err) => {
                    winston.error('[Master] Error: response error from target (%s %s on instance %s):', req.method, req.url, instance.toString(), err);

                    res.writeHead(500);
                    res.end(`[Master] Error: response error from target (${req.method} ${req.url} on instance ${instance.toString()}): ${err.toString()}`);
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

                const cleanHeaders = sanitize.headers(proxy_res.headers);

                instance.updateResponseHeaders(cleanHeaders);

                res.writeHead(proxy_res.statusCode, cleanHeaders);

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

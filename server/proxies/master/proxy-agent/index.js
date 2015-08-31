// Idea from: https://gist.github.com/matthias-christen/6beb3b4dda26bd6a221d

'use strict';

var http = require('http'),
    tls = require('tls'),
    util = require('util');


module.exports = ProxyAgent;


////////////

function ProxyAgent(opts) {
    this._agent = opts.agent;

    http.Agent.call(this, opts);
}
util.inherits(ProxyAgent, http.Agent);


ProxyAgent.prototype.createConnection = function createConnectionFn(opts, callback) {
    var proxyOpts = {
        host: opts.proxy.hostname,
        port: opts.proxy.port,
        path: opts.hostname + ':' + opts.port,
        method: 'CONNECT',
        agent: this._agent,
        headers: {},
    };

    if (opts.proxy.username && opts.proxy.password) {
        proxyOpts.headers['proxy-authorization'] = 'Basic ' + new Buffer(opts.proxy.username + ':' + opts.proxy.password).toString('base64');
    }

    var req = http.request(proxyOpts);

    req.on('error', function(err) {
        callback(err);
    });

    req.on('connect', function (res, socket, head) {
        socket.on('error', function (err) {
            callback(err);
        });

        if (opts.ssl) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Allow wrong certificates
            var cts = tls.connect({
                host: opts.hostname,
                socket: socket,
            }, function () {
                callback(false, cts);
            });

            cts.on('error', function (err) {
                callback(err);
            });
        }
        else {
            callback(false, socket);
        }
    });

    req.end();
};


ProxyAgent.prototype.addRequest = function(req, options) {
    // Legacy API: addRequest(req, host, port, path)
    if (typeof options === 'string') {
        options = {
            host: options,
            port: arguments[2],
            path: arguments[3]
        };
    }

    var name = this.getName(options);
    if (!this.sockets[name]) {
        this.sockets[name] = [];
    }

    if ( this.sockets[name].length < this.maxSockets) {
        this.createSocket(req, options, function(err, s) {
            if (err) return req.emit('error', err);

            req.onSocket(s);
        })
    } else {
        if (!this.requests[name]) {
            this.requests[name] = [];
        }

        this.requests[name].push(req);
    }
};


ProxyAgent.prototype.createSocket = function(req, options, callback) {
    var self = this;
    options = util._extend({}, options);
    options = util._extend(options, self.options);

    options.servername = options.host;
    if (req) {
        var hostHeader = req.getHeader('host');
        if (hostHeader) {
            options.servername = hostHeader.replace(/:.*$/, '');
        }
    }

    var name = self.getName(options);

    options.encoding = null;

    self.createConnection(options, function(err, s) {
        if (err) return callback(err);

        if (!self.sockets[name]) {
            self.sockets[name] = [];
        }
        self.sockets[name].push(s);

        s.on('free', onFree);
        s.on('close', onClose);
        s.on('agentRemove', onRemove);

        callback(false, s);


        ////////////

        function onFree() {
            self.emit('free', s, options);
        }

        function onClose(err) {
            self.removeSocket(s, options);
        }

        function onRemove() {
            self.removeSocket(s, options);

            s.removeListener('close', onClose);
            s.removeListener('free', onFree);
            s.removeListener('agentRemove', onRemove);
        }
    });
};


ProxyAgent.prototype.removeSocket = function(s, options) {
    var name = this.getName(options);
    var sets = [this.sockets];

    if (s.destroyed) {
        sets.push(this.freeSockets);
    }

    for (var sk = 0; sk < sets.length; sk++) {
        var sockets = sets[sk];

        if (sockets[name]) {
            var index = sockets[name].indexOf(s);
            if (index !== -1) {
                sockets[name].splice(index, 1);
                // Don't leak
                if (sockets[name].length === 0) {
                    delete sockets[name];
                }
            }
        }
    }

    if (this.requests[name] && this.requests[name].length) {
        var req = this.requests[name][0];

        this.createSocket(req, options, function(err, s) {
            if (err) return req.emit('error', err);

            s.emit('free');
        });
    }
};

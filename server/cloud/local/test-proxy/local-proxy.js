var _ = require('lodash'),
    http = require('http'),
    net = require('net'),
    url = require('url'),
    winston = require('winston');


module.exports = LocalProxy;


////////////

function LocalProxy(name, port) {
    var self = this;

    self._name = name;
    self._port = port;

    // HTTP Agent
    self._agent = new http.Agent();

    // Config server
    self._server = http.createServer();

    self._server.on('request', requestFn);
    self._server.on('connect', connectFn);


    ////////////

    function requestFn(req, res) {
        winston.debug('[LocalProxy/%s] request (%s) %s %s', self._name, req.connection.remoteAddress, req.method, req.url);

        var host = req.headers['host'];
        var srvUrl = url.parse('http://' + host);

        var headers = _.assign({}, req.headers, {
           'X-Cache-Name': self._name,
        });

        var proxy_req = http.request({
            host: srvUrl.hostname,
            port: srvUrl.port || 80,
            method: req.method,
            path: req.url,
            headers: headers,
            agent: self._agent,
        }, function (proxy_res) {
            res.on('error', function(err) {
                winston.error('[LocalProxy/%s] request (error client) %s => %s', self._name, req.url, err.toString());

                proxy_res.end();
            });

            proxy_res.pipe(res);

            res.writeHead(proxy_res.statusCode, proxy_res.headers);
        });

        proxy_req.on('error', function(err) {
            winston.error('[LocalProxy/%s] request (error proxy) %s => %s', self._name, req.url, err.toString());

            res.writeHead(400);

            res.end(err.toString());
        });

        req.pipe(proxy_req);
    }

    function connectFn(req, socket, head) {
        winston.debug('[LocalProxy/%s] connect (%s) %s %s', self._name, req.connection.remoteAddress, req.method, req.url);

        var srvUrl = url.parse('http://' + req.url);

        var proxy_socket = net.connect(srvUrl.port, srvUrl.hostname, function() {
            socket.write('HTTP/1.1 200 Connection established\r\n\r\n');

            proxy_socket.write(head);
            proxy_socket.pipe(socket);
            socket.pipe(proxy_socket);
        });

        socket.on('error', function(err) {
            winston.error('[LocalProxy/%s] connect (error client) %s => %s', self._name, req.url, err.toString());

            proxy_socket.socket.end();
        });

        proxy_socket.on('error', function(err) {
            winston.error('[LocalProxy/%s] connect (error proxy) %s => %s', self._name, req.url, err.toString());

            socket.socket.end();
        });
    }
}

LocalProxy.prototype.listen = function listenFn(done) {
    winston.debug('[LocalProxy/%s] proxy listen at port %d', this._name, this._port);

    this._server.listen(this._port, function(err) {
        if (err) {
            winston.error('[LocalProxy] cannot start proxy: ', err);

            return done(err);
        }

        done(null);
    });
};

LocalProxy.prototype.shutdown = function shutdownFn() {
    winston.debug('[LocalProxy/%s] shutdown proxy listen at port %d', this._name, this._port);

    this._server.close();
};
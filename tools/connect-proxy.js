'use strict';

var http = require('http'),
    net = require('net');


var server = http.createServer();

server.on('connect', function(req, socket, head) {
    var part = req.url.split(':');
    if (part.length !== 2) {
        console.error('WRONG TARGET:', req.url);
        return socket.end();
    }

    var hostname = part[0],
        port = parseInt(part[1]);

    if (!hostname || !port) {
        console.error('WRONG TARGET:', req.url);
        return socket.end();
    }

    console.log('connect to %s, port %d', hostname, port);
    var proxy_socket = net.Socket();
    proxy_socket.connect(port, hostname);

    socket.write('HTTP/1.1 200 Connection established\r\n\r\n');
    proxy_socket.write(head);

    socket.pipe(proxy_socket).pipe(socket);
});

server.listen(3128, function(err) {
    if (err) console.error('cannot start proxy');

    console.log('proxy listening at port 8123');
});
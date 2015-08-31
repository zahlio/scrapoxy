'use strict';

var http = require('http'),
    winston = require('winston');


var counter = {};
var num = 0;

var server = http.createServer(function(req, res) {
    switch (req.method) {
        case 'GET': {
            return processGET(req, res);
        }

        case 'POST': {
            return processPOST(req, res);
        }

        case 'PUT': {
            return processPUT(req, res);
        }

        default: {
            return processUnknown(req, res);
        }
    }


    ////////////

    function processGET(req, res) {
        winston.debug('[TestServer:%d/GET] %s %s', num++, req.method, req.url);

        req.headers['remote-address'] = req.connection.remoteAddress;

        var json = JSON.stringify(req.headers);

        res.writeHead(200, {
            'Content-Type': 'application/json',
        });
        res.end(json);
    }

    function processPOST(req, res) {
        winston.debug('[TestServer:%d/POST] %s %s', num++, req.method, req.url);

        var name = req.headers['x-cache-name'] || req.connection.remoteAddress;

        var count = counter[name] || 0;
        ++count;

        counter[name] = count;

        if (count <= 2) {
            res.writeHead(200, {
                'Content-Type': 'text/plain',
            });
        }
        else {
            res.writeHead(503, {
                'Content-Type': 'text/plain',
            });
        }

        res.end('' + count);
    }

    function processPUT(req, res) {
        winston.debug('[TestServer:%d/PUT] %s %s', num++, req.method, req.url);

        var name = req.headers['x-cache-name'] || req.connection.remoteAddress;

        var count = counter[name] || 0;
        ++count;

        counter[name] = count;

        var max = 7500;
        var discard;
        if (count < max) {
            if (Math.random() * (count / max) > 0.7) {
                discard = true;
            }
            else {
                discard = false;
            }
        }
        else {
            discard = true;
        }

        if (discard) {
            res.writeHead(503);
        }
        else {
            res.writeHead(200);
        }

        res.end();
    }

    function processUnknown(req, res) {
        winston.debug('[TestServer:%d/Unknown] %s %s', num++, req.method, req.url);

        res.writeHead(500, {
            'Content-Type': 'text/plain',
        });

        res.end('Unknown method');
    }
});


server.on('clientError', function(err) {
    console.log('[clientError] ', err);
});

server.listen(13337, function(err) {
    if (err) {
        winston.error('[TestServer] ', err);
        process.exit(1);
    }

    winston.debug('[TestServer] server started');
});


module.exports = server;
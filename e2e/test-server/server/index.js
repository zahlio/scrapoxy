'use strict';

const TestServer = require('./test-server'),
    sigstop = require('../../../server/common/sigstop'),
    winston = require('winston');


if (process.argv.length !== 3) {
    winston.info('test-server usage: node ./index.js <port>');

    process.exit(1);
}

const port = parseInt(process.argv[2]);

const server = new TestServer(port);

sigstop(() => {
    server.shutdown();

    process.exit(0);
});

server.listen((err) => {
    if (err) {
        return process.exit(1);
    }
});

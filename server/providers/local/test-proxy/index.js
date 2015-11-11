var LocalProxy = require('./local-proxy'),
    sigstop = require('../../../common/sigstop'),
    winston = require('winston');


if (process.argv.length !== 4 ) {
    console.log('test-proxy usage: node ./index.js <name> <port>');

    process.exit(1);
}

var name = process.argv[2],
    port = parseInt(process.argv[3]);

var proxy = new LocalProxy(name, port);

sigstop(function() {
    proxy.shutdown();

    process.exit(0);
});

proxy.listen(function(err) {
    if (err) return process.exit(1);
});

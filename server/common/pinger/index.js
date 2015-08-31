'use strict';

var Promise = require('bluebird'),
    net = require('net'),
    winston = require('winston');


module.exports = {
    ping: ping,
    pingRetry: pingRetry,
    waitPing: waitPing,
};


////////////

function ping(options) {
    if (!options || !options.hostname || !options.port) {
        throw new Error('[ping] should have hostname and port');
    }

    winston.debug('[pinger] ping: hostname=%s / port=%d', options.hostname, options.port);

    // Set default timeout to 5s
    options.timeout = options.timeout || 5000;

    return new Promise(function(resolve, reject) {
        var s = new net.Socket();

        s.connect(options.port, options.hostname, function() {
            // Connected !
            s.destroy();

            resolve();
        });

        s.on('error', function(err) {
            // Connexion error
            s.destroy();

            reject(err);
        });

        s.setTimeout(options.timeout, function() {
            // Connexion error: timeout
            s.destroy();

            reject(Error('Request timeout'));
        });
    });
}

function pingRetry(options, retry, retryDelay) {
    if (!options || !options.hostname || !options.port || !retryDelay) {
        throw new Error('[pingRetry] should have hostname, port, retry and retryDelay');
    }

    retry = retry || 0;

    winston.debug('[pinger] pingRetry: hostname=%s / port=%d / retry=%d / retryDelay=%d', options.hostname, options.port, retry, retryDelay);

    return ping(options)
        .catch(function(err) {
            if (retry > 0) {
                return Promise
                    .delay(retryDelay)
                    .then(function() {
                        return pingRetry(options, retry - 1, retryDelay);
                    });
            } else {
                throw err;
            }
        });
}

function waitPing(options, retryDelay, timeout) {
    if (!options || !options.hostname || !options.port || !retryDelay) {
        throw new Error('[waitPing] should have hostname, port and retryDelay');
    }

    winston.debug('[pinger] waitPing: hostname=%s / port=%d / timeout=%d / retryDelay=%d', options.hostname, options.port, timeout, retryDelay);

    var start = new Date().getTime();

    return pingImpl();


    ////////////

    function pingImpl() {
        winston.debug('[pinger] waitPing: try %s:%d', options.hostname, options.port);

        return ping(options)
            .catch(function(err) {
                var end = new Date().getTime();

                if (timeout && (end - start > timeout)) {
                    throw err;
                } else {
                    return Promise
                        .delay(retryDelay)
                        .then(function() {
                            return pingImpl();
                        });
                }
            });
    }
}

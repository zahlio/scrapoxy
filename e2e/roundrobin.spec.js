'use strict';

var Promise = require('bluebird'),
    Proxies = require('../server/proxies'),
    simplerequest = require('./simplerequest'),
    should = require('should'),
    winston = require('winston');

var config = require('./config'),
    app = require('./test-server'),
    provider = require('./provider');


config.instance.scaling.min = 2;
config.instance.scaling.max = 2;


// Proxy config
var proxy = {
    hostname: '127.0.0.1',
    port: config.proxy.port,
    //username: config.proxy.auth.username,
    //password: config.proxy.auth.password,
};


describe('send requests with round-robin', function() {
    this.timeout(90 * 1000);

    var proxies;

    before(function() {
        proxies = new Proxies(config, provider);

        return proxies.listenAndWait();
    });

    after(function() {
        return proxies.shutdown();
    });


    var knownProxies = [];
    var knownAgents = [];

    // These requests are sent to a new proxy
    for (var i = 0; i < config.instance.scaling.min; ++i) {
        it('should request on unknown proxy ' + i, function () {
            return simplerequest.getWithProxy(config.test.mirror, proxy)
                .then(function (response) {
                    response.statusCode.should.equal(200);

                    // Check name of the proxy
                    var name = response.json['x-cache-name'] || response.json['remote-address'];
                    name.should.not.be.empty;

                    if (knownProxies.indexOf(name) >= 0) {
                        throw new Error('request does not swap');
                    }
                    knownProxies.push(name);

                    // Check useragent
                    var useragent = response.json['user-agent'];

                    if (knownAgents.indexOf(useragent) >= 0) {
                        throw new Error('useragent does not swap');
                    }

                    knownAgents.push(useragent);
                });
        });
    }

    // This request is sent to a known proxy
    it('should request on known proxy', function () {
        return simplerequest.getWithProxy(config.test.mirror, proxy)
            .then(function (response) {
                response.statusCode.should.equal(200);

                // Check name of the proxy
                var name = response.json['x-cache-name'] || response.json['remote-address'];
                name.should.not.be.empty;

                if (knownProxies.indexOf(name)< 0) {
                    throw new Error('request sent to a unknown proxy');
                }

                // Don't check useragent here => not needed
            });
    });
});

'use strict';

var Promise = require('bluebird'),
    pinger = require('../server/common/pinger'),
    Proxies = require('../server/proxies'),
    simplerequest = require('./simplerequest'),
    should = require('should'),
    winston = require('winston');

var config = require('./config'),
    app = require('./test-server'),
    cloud = require('./cloud');

// Proxy config
var proxy = {
    hostname: '127.0.0.1',
    port: config.proxy.port,
    //username: config.proxy.auth.username,
    //password: config.proxy.auth.password,
};

describe('upscale / downscale proxies', function() {
    this.timeout(120 * 1000);

    var proxies;

    before(function() {
        proxies = new Proxies(config, cloud);

        return proxies.listenAndWait();
    });

    after(function() {
        return proxies.shutdown();
    });

    it('should have ' + config.instance.scaling.min + ' proxies', function() {
        var instances = proxies.getManager().getInstances();

        instances.should.have.length(config.instance.scaling.min);
    });

    it('should accept 1 request', function() {
        return simplerequest.getWithProxy(config.test.mirror, proxy)
            .then(function (response) {
                response.statusCode.should.equal(200);
            });
    });

    it('should have ' + config.instance.scaling.max + ' proxies', function() {
        return Promise.delay(5 * 1000)
            .then(function() {
                return proxies.getManager().getInstances();
            })
            .map(function (instance) {
                return pinger.waitPing(
                    instance.getModel().getAddress(),
                    config.instance.checkDelay,
                    10 * 1000);
            })
            .then(function(items) {
                items.should.have.length(config.instance.scaling.max);
            });
    });

    it('should have ' + config.instance.scaling.min + ' proxies', function() {
        return Promise.delay(30 * 1000)
            .then(function() {
                return proxies.getManager().getInstances();
            })
            .map(function (instance) {
                return pinger.waitPing(
                    instance.getModel().getAddress(),
                    config.instance.checkDelay,
                    10 * 1000);
            })
            .then(function(items) {
                items.should.have.length(config.instance.scaling.min);
            });
    });
});

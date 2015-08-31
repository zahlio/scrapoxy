'use strict';

var _ = require('lodash'),
    Promise = require('bluebird'),
    Proxies = require('../server/proxies'),
    sequential = require('./sequential'),
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


describe('test load with proxies', function() {
    this.timeout(4 * 60 * 1000);

    var proxies;

    before(function() {
        proxies = new Proxies(config, cloud);

        return proxies.listenAndWait();
    });

    after(function() {
        return proxies.shutdown();
    });

    it('should have enough good requests', function(done) {
        //var urls = new Array(10 * 1000);
        var urls = new Array(7 * 1000);
        _.fill(urls, config.test.mirror);

        var chunks =_.chunk(urls, 50);
        var result = new Array(chunks.length);

        sequential(chunks, result, function(chunk) {
            return Promise.map(chunk, function(url) {
                return simplerequest.putWithProxy(url, {}, proxy)
                    .then(function (response) {
                        return response.statusCode;
                    })
                    .catch(function() {
                        return 999;
                    })
                    .then(function(status) {
                        return status;
                    });
            });
        }, 50, 0)
            .then(function() {
                var count = _(result)
                    .flatten()
                    .countBy()
                    .value();

                var total = _(count)
                    .values()
                    .sum();

                var count = _(count)
                    .pairs()
                    .map(function(d) {
                        return {
                            code: d[0],
                            count: d[1],
                            rate: Math.round((100.0 * d[1]) / total),
                        };
                    })
                    .indexBy('code')
                    .value();

                // min 90% of response statuses must be 200
                count['200'].rate.should.be.above(90);

                done();
            });
    });
});

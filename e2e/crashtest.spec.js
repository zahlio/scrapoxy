'use strict';

var _ = require('lodash'),
    Promise = require('bluebird'),
    Proxies = require('../server/proxies'),
    should = require('should'),
    winston = require('winston');

var config = require('./config'),
    app = require('./test-server'),
    cloud = require('./cloud');


describe('restart crashed instance', function() {
    this.timeout(120 * 1000);

    var proxies;

    before(function() {
        proxies = new Proxies(config, cloud);

        return proxies.listenAndWait();
    });

    after(function() {
        return proxies.shutdown();
    });


    it('should kill an instance', function() {
        var instances = proxies.getManager().getInstances();
        instances.should.have.length(config.instance.scaling.min);

        return proxies.getManager().crashRandomInstance();
    });

    it('should restart an instance', function() {
        return Promise.delay(10 * 1000).
            then(function() {
                var instances = proxies.getManager().getInstances();
                instances.should.have.length(config.instance.scaling.min);
            })
    });
});

'use strict';

var Promise = require('bluebird'),
    pinger = require('../../common/pinger'),
    should = require('should'),
    winston = require('winston');

var CloudLocal = require('./index');


describe('CloudLocal', function() {
    this.timeout(10 * 1000);

    var cloud;

    before(function() {
        cloud = new CloudLocal('./server/cloud/local/test-proxy/index.js');
    });

    describe('start/stop', function() {
        var models;

        it('should start', function() {
            return cloud.createInstances(2)
                .delay(2000)
                .then(function() {
                    return cloud.getModels();
                })
                .then(function(mds) {
                    mds.should.have.length(2);

                    models = mds;
                });
        });

        it('should be alive (ping)', function() {
            return Promise.map(models, function(model) {
                return pinger.pingRetry(model.getAddress(), 2, 2000);
            });
        });

        it('should shutdown', function() {
            return cloud.deleteInstances(models)
                .delay(2000);
        });

        it('should be dead (ping)', function(done) {
            Promise.map(models, function(model) {
                return pinger.pingRetry(model.getAddress(), 2, 500);
            })
                .then(function() {
                    done(new Error('Ping should not work!'));
                })
                .catch(function() {
                    done();
                })
        });
    });

    describe('change address', function() {
        var model;

        it('should start', function() {
            return cloud.createInstances(1)
                .delay(2000)
                .then(function() {
                    return cloud.getModels();
                })
                .then(function(mds) {
                    mds.should.have.length(1);

                    model = mds[0];

                    return pinger.pingRetry(model.getAddress(), 2, 2000);
                });
        });

        it('should restart', function() {
            return cloud.stopInstance(model)
                .delay(2000)
                .then(function() {
                    return cloud.startInstance(model);
                })
                .delay(2000)
                .tap(function() {
                    return pinger.pingRetry(model.getAddress(), 2, 2000);
                })
                .then(function() {
                    return cloud.deleteInstances([model]);
                })
        });
    });
});
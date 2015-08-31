'use strict';

var _ = require('lodash');

var secret = require('../server/config-secret');

module.exports = _.merge({
    test: {
        mirror: 'http://127.0.0.1:13337',
    },

    proxy: {
        port: 8888,
    },

    commander: {
        port: 8889,
    },

    instance: {
        port: 3128,

        checkDelay: 1 * 1000,
        checkAliveDelay: 2 * 1000,
        stopIfCrashedDelay: 4 * 1000,

        autorestart: {
            minDelay: 10 * 60 * 1000,
            maxDelay: 10 * 60 * 1000,
        },

        scaling: {
            min: 1,
            max: 3,
            downscaleDelay: 10 * 1000,
        },
    },

    ec2: {
        region: 'eu-west-1',
        tag: 'Proxy',
        instance: {
            InstanceType: 't1.micro',
        },
        maxRunningInstances: 10,
    },
}, secret);

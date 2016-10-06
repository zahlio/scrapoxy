'use strict';

const _ = require('lodash');


const configDefaults = require('../server/config.defaults');

module.exports = _.merge({}, configDefaults, {
    test: {
        mirror: 'http://127.0.0.1:13337',
    },

    commander: {
        password: 'command',
    },

    instance: {
        port: 3128,

        checkDelay: 1 * 1000,
        checkAliveDelay: 2 * 1000,
        stopIfCrashedDelay: 4 * 1000,
        addProxyNameInRequest: true,

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

    providers: {
        type: 'awsec2',

        awsec2: {
            region: 'eu-west-1',
            instance: {
                InstanceType: 't1.micro',
                ImageId: 'ami-c74d0db4',
                SecurityGroups: [
                    'forward-proxy',
                ],
                KeyName: 'proxy',
            },
            maxRunningInstances: 20,
        },
    },

    logs: {
        path: '../logs',
    },
});

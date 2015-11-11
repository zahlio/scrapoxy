'use strict';


module.exports = {
    proxy: {
        port: 8888,
    },

    commander: {
        port: 8889,
    },

    instance: {
        checkDelay: 10 * 1000, // 10sec
        checkAliveDelay: 20 * 1000, // 20sec
        stopIfCrashedDelay: 5 * 60 * 1000, // 5min,

        autorestart: {
            minDelay: 1 * 60 * 60 * 1000, // 1h
            maxDelay: 12 * 60 * 60 * 1000, // 12h
        },

        scaling: {
            downscaleDelay: 10 * 60 * 1000, // 10min
        },
    },

    providers: {
        awsec2: {
            tag: 'Proxy',
        },
    },

    stats: {
        retention: 24 * 60 * 60 * 1000, // 24h

        samplingDelay: 1000,
    },

    test: {
        //mirror: 'http://91.121.178.196:13337',
    },
};

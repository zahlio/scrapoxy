#! /usr/bin/env node

'use strict';

var _ = require('lodash'),
    Promise = require('bluebird'),
    ProviderAWSEC2 = require('./providers/awsec2'),
    ProviderOVHCloud = require('./providers/ovhcloud'),
    fs = require('fs'),
    moment = require('moment'),
    ovh = require('ovh'),
    path = require('path'),
    program = require('commander'),
    Proxies = require('./proxies'),
    sigstop = require('./common/sigstop'),
    template = require('./template'),
    TestProxy = require('./test-proxy'),
    winston = require('winston');

var configDefaults = require('./config.defaults');


// Add timestamp to log
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {timestamp: true});


program
    .version('2.0.1')
    .option('-d, --debug', 'Debug mode (increase verbosity)', debugMode)
    .parse(process.argv);

program
    .command('start [my-config.json]')
    .description('Start proxy with a configuration')
    .action(function (configFilename) {
        startProxy(configFilename)
    });

program
    .command('init [my-config.json]')
    .description('Create configuration file with a template')
    .action(function (configFilename) {
        initConfig(configFilename)
    });

program
    .command('test [url] [count]')
    .description('Test the proxy at url')
    .action(function (url, count) {
        testProxy(url, count)
    });

program
    .command('ovh-consumerkey [endpoint] [appKey] [appSecret]')
    .description('Get the OVH consumerKey')
    .action(function (endpoint, appKey, appSecret) {
        ovhConsumerKey(endpoint, appKey, appSecret)
    });


program
    .parse(process.argv);

if (!program.args.length) {
    program.help();
}


////////////

function initConfig(configFilename) {
    if (!configFilename || configFilename.length <= 0) {
        return winston.error('Error: Config file not specified');
    }

    fs.exists(configFilename, function (exists) {
        if (exists) {
            return winston.error('Error: config file already exists');
        }

        template.write(configFilename, function (err) {
            if (err) return winston.error('[Template] Cannot write template to %s', configFilename);

            winston.info('Template written in %s', configFilename);
        });
    });
}


function startProxy(configFilename) {
    if (!configFilename || configFilename.length <= 0) {
        return winston.error('Error: Config file not specified');
    }

    configFilename = path.resolve(process.cwd(), configFilename);

    // Load config
    var config;
    try {
        var myConfig = require(configFilename);
        config = _.merge({}, configDefaults, myConfig);
    }
    catch (err) {
        return winston.error('Error: Cannot load config (%s)', err.toString());
    }

    // Write logs (if specified)
    if (config.logs && config.logs.path) {
        winston.add(winston.transports.File, {
            filename: config.logs.path + '/scrapoxy_' + moment().format('YYYYMMDD_HHmmss') + '.log',
            json: false,
            timestamp: true,
        });
    }

    // Initialize
    var provider = getProvider(config);
    if (!provider) {
        return winston.error('Error: Provider is not specify or supported');
    }

    var main = new Proxies(config, provider);

    // Register stop event
    sigstop(function () {
        main.shutdown()
            .then(function () {
                process.exit(0);
            });
    });


    // Start
    main.listen();


    ////////////

    function getProvider(config) {
        switch (config.providers.type) {
            case 'ovhcloud':
            {
                return new ProviderOVHCloud(config.providers.ovhcloud, config.instance.port);
            }

            case 'awsec2':
            {
                return new ProviderAWSEC2(config.providers.awsec2, config.instance.port);
            }

            default: {
                return;
            }
        }
    }
}


function testProxy(proxyUrl, count) {
    if (!proxyUrl || proxyUrl.length <= 0) {
        return winston.error('Error: URL not specified');
    }

    // Default: 10 / Max: 1000
    count = Math.min(count || 10, 1000);

    var testProxy = new TestProxy(proxyUrl);

    var promises = [];
    for (var i = 0; i < count; ++i) {
        promises.push(testProxy.request());
    }

    Promise
        .all(promises)
        .then(function () {
            winston.info('%d IPs found:', testProxy.size());

            _.forEach(testProxy.getCount(), function (value, key) {
                winston.info('%s (%d times)', key, value);
            });
        })
        .catch(function (err) {
            winston.error('Error:', err);
        });
}


function ovhConsumerKey(endpoint, appKey, appSecret) {
    if (!appKey || appKey.length <= 0 ||
        !appSecret || appSecret.length <= 0) {
        return winston.error('Error: appKey or appSecret not specified');
    }

    var client = ovh({
        endpoint: endpoint,
        appKey: appKey,
        appSecret: appSecret,
        consumerKey: 'WFfsXEgHST3GevEmQQKK4YzpNI73UcmW',
    });

    client.request('POST', '/auth/credential', {
        'accessRules': [
            { 'method': 'GET', 'path': '/cloud/*'},
            { 'method': 'POST', 'path': '/cloud/*'},
            { 'method': 'PUT', 'path': '/cloud/*'},
            { 'method': 'DELETE', 'path': '/cloud/*'}
        ]
    }, function (err, credential) {
        if (err) return winston.error('Cannot get consumerKey: ', err);

        winston.info('Your consumerKey is: %s', credential.consumerKey);
        winston.info('Please validate your token here: %s', credential.validationUrl);
    });
}


function debugMode() {
    winston.level = 'debug';
}

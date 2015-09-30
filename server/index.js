#! /usr/bin/env node

'use strict';

var _ = require('lodash'),
    Promise = require('bluebird'),
    CloudEC2 = require('./cloud/ec2'),
    fs = require('fs'),
    moment = require('moment'),
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
    .action(function(configFilename) {
        startProxy(configFilename)
    });

program
    .command('init [my-config.json]')
    .description('Create configuration file with a template')
    .action(function(configFilename) {
        initConfig(configFilename)
    });

program
    .command('test [url] [count]')
    .description('Test the proxy at url')
    .action(function(url, count) {
        testProxy(url, count)
    });

program
    .parse(process.argv);

if (!program.args.length) {
    program.help();
}


////////////

function initConfig(configFilename) {
    if (!configFilename || configFilename.length <= 0) {
        return console.log('Error: Config file not specified');
    }

    fs.exists(configFilename, function(exists) {
        if (exists) {
            return console.log('Error: config file already exists');
        }

        template.write(configFilename, function(err) {
            if (err) return winston.error('[Template] Cannot write template to %s', configFilename);

            winston.info('Template written in %s', configFilename);
        });
    });
}


function startProxy(configFilename) {
    if (!configFilename || configFilename.length <= 0) {
        return console.log('Error: Config file not specified');
    }

    configFilename = path.resolve(process.cwd(), configFilename);

    // Load config
    var config;
    try {
        var myConfig = require(configFilename);
        config = _.merge({}, configDefaults, myConfig);
    }
    catch(err) {
        return console.log('Error: Cannot load config (%s)', err.toString());
    }

    // Write logs (if specified)
    if (config.logs && config.logs.path) {
        winston.add(winston.transports.File, {
            filename: config.logs.path + '/scrapoxy_' + moment().format('YYYYMMDD_HHmmss') + '.log',
            json: false,
            timestamp: true,
        });
    }

    // Init Proxies Manager
    var cloud = new CloudEC2(config.ec2, config.instance.port);

    var main = new Proxies(config, cloud);

    // Register stop event
    sigstop(function() {
        main.shutdown()
            .then(function() {
                process.exit(0);
            });
    });


    // Start
    main.listen();
}


function testProxy(proxyUrl, count) {
    if (!proxyUrl || proxyUrl.length <= 0) {
        return console.log('Error: URL not specified');
    }

    count = count || 10;

    var testProxy = new TestProxy(proxyUrl);

    var promises = [];
    for (var i = 0; i < count; ++i) {
        promises.push(testProxy.request());
    }

    Promise
        .all(promises)
        .then(function() {
            console.log('IPs found:');

            _.forEach(testProxy.getCount(), function(value, key) {
                console.log('%s (%d times)', key, value);
            });
        })
        .catch(function(err) {
            console.log('Error:', err);
        });
}


function debugMode() {
    winston.level = 'debug';
}

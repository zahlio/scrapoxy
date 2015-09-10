#! /usr/bin/env node

'use strict';

var _ = require('lodash'),
    CloudEC2 = require('./cloud/ec2'),
    fs = require('fs'),
    path = require('path'),
    program = require('commander'),
    Proxies = require('./proxies'),
    request = require('request'),
    sigstop = require('./common/sigstop'),
    template = require('./template'),
    winston = require('winston');

var configDefaults = require('./config.defaults');


program
    .version('2.0.0')
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
    .command('test [url]')
    .description('Test the proxy at url')
    .action(function(url) {
        testProxy(url)
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

            winston.info('[Template] Template written in %s', configFilename);
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


function testProxy(url) {
    if (!url || url.length <= 0) {
        return console.log('Error: URL not specified');
    }

    var opts = {
        url: 'http://api.ipify.org',
        proxy: url,
    };

    var num = 0;
    for (var i = 0; i < 10; ++i) {
        request(opts, function (err, response, body) {
            if (err) {
                return console.error(err.toString());
            }

            if (response.statusCode !== 200) {
                return console.error('(%d) %s', response.statusCode, body);
            }

            console.log('Request #%d: IP=%s', num++, body);
        });
    }
}


function debugMode() {
    winston.level = 'debug';
}

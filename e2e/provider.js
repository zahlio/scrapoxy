'use strict';


var ProviderLocal = require('../server/provider/local');
//var ProviderAWSEC2 = require('../server/provider/awsec2');

//var config = require('./config');

var provider = new ProviderLocal('./server/provider/local/test-proxy/index.js');
//var provider = new ProviderAWSEC2(config.awsec2, config.instance.port);


module.exports = provider;
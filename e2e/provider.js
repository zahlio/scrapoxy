'use strict';

const ProviderLocal = require('./providers/local');
//const ProviderAWSEC2 = require('../server/providers/awsec2');

//const config = require('./config');

const provider = new ProviderLocal();
//const provider = new ProviderAWSEC2(config.awsec2, config.instance.port);


module.exports = provider;

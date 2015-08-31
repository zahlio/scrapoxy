'use strict';


var CloudLocal = require('../server/cloud/local');
//var CloudEC2 = require('../server/cloud/ec2');

//var config = require('./config');

var cloud = new CloudLocal('./server/cloud/local/test-proxy/index.js');
//var cloud = new CloudEC2(config.ec2, config.instance.port);


module.exports = cloud;
'use strict';

var fs = require('fs');


module.exports = {
    write: write,
};


////////////

var template = {
    commander: {
        password: 'CHANGE_THIS_PASSWORD',
    },

    instance: {
        port: 3128,

        scaling: {
            min: 1,
            max: 3,
        },
    },

    ec2: {
        region: 'YOUR REGION (could be: eu-west-1)',
        tag: 'Proxy',
        instance: {
            InstanceType: 't1.micro',
            ImageId: 'ami-1aa0ea6d', // Forward proxy
            SecurityGroups: ['YOUR SECURITY GROUPS'],
        },
        maxRunningInstances: 10,
    },
};

function write(target, done) {
    var data = JSON.stringify(template, null, 4);

    fs.writeFile(target, data, function(err) {
        if (err) {
            return done(err);
        }

        done();
    });
}
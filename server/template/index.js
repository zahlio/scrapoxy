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

    providers: {
        type: 'awsec2',

        awsec2: {
            accessKeyId: 'YOUR ACCESS KEY ID',
            secretAccessKey: 'YOUR SECRET ACCESS KEY',
            region: 'YOUR REGION (could be: eu-west-1)',
            instance: {
                InstanceType: 't1.micro',
                ImageId: 'ami-1aa0ea6d', // Forward proxy node
                SecurityGroups: ['forward-proxy'],
            },
            maxRunningInstances: 10,
        },

        ovhcloud: {
            endpoint: 'YOUR ENDPOINT (could be: ovh-eu)',
            appKey: 'YOUR APP KEY',
            appSecret: 'YOUR APP SECRET',
            consumerKey: 'YOUR CONSUMER KEY',
            serviceId: 'YOUR SERVICE ID',
            region: 'YOUR REGION (could be: GRA1)',
            flavorName: 'vps-ssd-1',
            snapshotName: 'YOUR SNAPSHOT NAME (could be: forward-proxy)',
            maxRunningInstances: 10,
        },
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
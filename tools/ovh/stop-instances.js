'use strict';

const ovh = require('ovh');

const config = require('../../server/conf.json');

const client = ovh({
    endpoint: config.ovh.endpoint,
    appKey: config.ovh.appKey,
    appSecret: config.ovh.appSecret,
    consumerKey: config.ovh.consumerKey,
});

const options = {
    serviceName: config.ovh.serviceId
};

client.request('GET', '/cloud/project/{serviceName}/instance', options, (err, instances) => {
    if (err) return console.error(err);

    console.log(instances);

    instances.forEach((instance) => {
        const options = {
            serviceName: config.ovh.serviceId,
            instanceId: instance.id,
        };

        client.request('DELETE', '/cloud/project/{serviceName}/instance/{instanceId}', options, (err) => {
            if (err) return console.error(err);

            console.log('removed ' + instance.id);
        });
    })
});

var ovh = require('ovh');

var config = require('../../server/my-config.json');

var client = ovh({
    endpoint: config.ovh.endpoint,
    appKey: config.ovh.appKey,
    appSecret: config.ovh.appSecret,
    consumerKey: config.ovh.consumerKey,
});

var options = {
    serviceName: config.ovh.serviceId
};

client.request('GET', '/cloud/project/{serviceName}/instance', options, function (err, instances) {
    if (err) return console.error(err);

    console.log(instances);

    instances.forEach(function(instance) {
        var options = {
            serviceName: config.ovh.serviceId,
            instanceId: instance.id,
        };

        client.request('DELETE', '/cloud/project/{serviceName}/instance/{instanceId}', options, function (err, result) {
            if (err) return console.error(err);

            console.log('removed ' + instance.id);
        });
    })
});
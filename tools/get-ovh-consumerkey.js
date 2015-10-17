var ovh = require('ovh');

var config = require('../server/my-config.json');

var client = ovh({
    endpoint: config.ovh.endpoint,
    appKey: config.ovh.appKey,
    appSecret: config.ovh.appSecret,
});


self._client.request('GET', '/cloud/project/{serviceName}/instance', options, function (err, instances) {
    if (err) return reject(err);

    resolve(instances);
});
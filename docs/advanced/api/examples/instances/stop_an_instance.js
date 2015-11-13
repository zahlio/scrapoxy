/*
 * Stop an instance
 */

var request = require('request');

var password = 'YOUR_COMMANDER_PASSWORD',
    instanceName = 'YOUR INSTANCE NAME';

var opts = {
    method: 'POST',
    url: 'http://localhost:8889/api/instances/stop',
    json: {
        name: instanceName,
    },
    headers: {
        'Authorization': new Buffer(password).toString('base64'),
    },
};

request(opts, function (err, res, body) {
    if (err) return console.log('Error: ', err);

    console.log('Status: %d\n\n', res.statusCode);

    console.log(body);
});
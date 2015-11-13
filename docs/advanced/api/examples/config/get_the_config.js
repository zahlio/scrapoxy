/*
 * Get the configuration
 */

var request = require('request');

var password = 'YOUR_COMMANDER_PASSWORD';

var opts = {
    method: 'GET',
    url: 'http://localhost:8889/api/config',
    headers: {
        'Authorization': new Buffer(password).toString('base64'),
    },
};

request(opts, function (err, res, body) {
    if (err) return console.log('Error: ', err);

    console.log('Status: %d\n\n', res.statusCode);

    var bodyParsed = JSON.parse(body);

    console.log(bodyParsed);
});
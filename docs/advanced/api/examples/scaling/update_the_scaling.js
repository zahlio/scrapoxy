/*
 * Update the scaling
 */

var request = require('request');

var password = 'YOUR_COMMANDER_PASSWORD';

var opts = {
    method: 'PATCH',
    url: 'http://localhost:8889/api/scaling',
    json: {
        min: 1,
        required: 5,
        max: 10,
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
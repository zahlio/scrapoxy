/*
 * Get all alive instances
 */

const request = require('request');

const password = 'YOUR_COMMANDER_PASSWORD';

const opts = {
    method: 'GET',
    url: 'http://localhost:8889/api/instances',
    headers: {
        'Authorization': new Buffer(password).toString('base64'),
    },
};

request(opts, (err, res, body) => {
    if (err) return console.log('Error: ', err);

    console.log('Status: %d\n\n', res.statusCode);

    const bodyParsed = JSON.parse(body);

    console.log(bodyParsed);
});
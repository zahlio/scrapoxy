/*
 * Update the scaling WITH configuration
 */

const request = require('request');

const password = 'YOUR_COMMANDER_PASSWORD';

const opts = {
    method: 'PATCH',
    url: 'http://localhost:8889/api/config',
    json: {
        instance: {
            scaling: {
                max: 300,
            },
        },
    },
    headers: {
        'Authorization': new Buffer(password).toString('base64'),
    },
};

request(opts, (err, res, body) => {
    if (err) return console.log('Error: ', err);

    console.log('Status: %d\n\n', res.statusCode);

    console.log(body);
});
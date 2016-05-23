'use strict';

const _ = require('lodash');


module.exports = {
    headers: sanitizeHeaders,
};


////////////

const reRemove = new RegExp('[^A-Za-z0-9\-]+', 'g');


function sanitizeHeaders(h) {
    if (!h) {
        return {};
    }


    const res = {};
    _.forEach(h, (val, key) => {
        if (!key) {
            return;
        }

        key = key.replace(reRemove, '');
        if (key.length <= 0) {
            return;
        }

        res[key] = val;
    });

    return res;
}

'use strict';

const Promise = require('bluebird');


module.exports = sequential;


////////////

function sequential(from, to, func, delay, idx) {
    idx = idx || 0;

    if (idx >= from.length) {
        return Promise.resolve();
    }
    else {
        const item = from[idx];

        return func(item)
            .then((res) => to[idx] = res)
            .delay(delay)
            .then(() => sequential(from, to, func, delay, idx + 1));
    }
}

'use strict';

module.exports = sequential;


////////////

function sequential(from, to, func, delay, idx) {
    idx = idx || 0;

    if (idx >= from.length) {
        return Promise.resolve();
    }
    else {
        var item = from[idx];

        return func(item)
            .then(function(res) {
                to[idx] = res;
            })
            .delay(delay)
            .then(function() {
                return sequential(from, to, func, delay, idx + 1);
            });
    }
}

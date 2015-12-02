'use strict';

module.exports = {
    checkScalingIntegrity,
    omitDeep,
};


////////////

function checkScalingIntegrity(scaling) {
    if (!scaling) {
        return;
    }

    scaling.min = Math.max(0, scaling.min || 0);
    scaling.required = Math.max(0, scaling.required || 0);
    scaling.max = Math.max(0, scaling.max || 0);

    if (scaling.min > scaling.required) {
        scaling.required = scaling.min;
    }

    if (scaling.max < scaling.required) {
        scaling.max = scaling.required;
    }
}


function omitDeep(obj, keys) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((d) => omitDeep(d, keys));
    }

    const target = {};
    Object.keys(obj).forEach((key) => {
        if (keys.indexOf(key) < 0) {
            target[key] = omitDeep(obj[key], keys);
        }
    });

    return target;
}

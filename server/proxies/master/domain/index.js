'use strict';

var url = require('url');


module.exports = {
    getBaseDomainForUri: getBaseDomainForUri,
    convertHostnamePathToUri: convertHostnamePathToUri,
};


////////////

function getBaseDomainForUri(uri) {
    if (!uri) {
        return;
    }

    var urlOpts = url.parse(uri);
    if (!urlOpts.hostname) {
        return;
    }

    if (isIPv4(urlOpts.hostname)) {
        return urlOpts.hostname;
    }

    return getMasterDomain(urlOpts.hostname);


    ////////////

    function isIPv4(hostname) {
        return hostname.match(/^(([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)\.){3}([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)$/);
    }

    function getMasterDomain(hostname) {
        var part = hostname.split('.');
        if (part.length < 2) {
            return hostname;
        }

        return part[part.length - 2] + '.' + part[part.length - 1];
    }
}

function convertHostnamePathToUri(hostname, path) {
    if (hostname) {
        var urlOpts = {
            protocol: 'http',
            hostname: hostname
        };

        var base = url.format(urlOpts);

        if (path) {
            return url.resolve(base, path);
        } else {
            return base;
        }
    } else {
        return path;
    }
}

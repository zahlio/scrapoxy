'use strict';

const _ = require('lodash'),
    Promise = require('bluebird'),
    https = require('https'),
    url = require('url');


module.exports = class DigitalOceanAPI {
    constructor(token) {
        this._token = token;
    }


    // DROPLETS
    getAllDroplets() {
        const options = {
            method: 'GET',
            path: '/droplets',
        };

        return this._makePaginateRequests('droplets', options);
    }


    createDroplet(params) {
        const options = {
            method: 'POST',
            path: '/droplets',
        };

        return this._makeRequest(options, params);
    }


    powerOnDroplet(id) {
        const params = {
            type: 'power_on',
        };

        const options = {
            method: 'POST',
            path: `/droplets/${id}/actions`,
        };

        return this._makeRequest(options, params);
    }


    removeDroplet(id) {
        const options = {
            method: 'DELETE',
            path: `/droplets/${id}`,
        };

        return this._makeRequest(options)
            .catch((err) => {
                if (err.message) {
                    throw err.message;
                }
                else {
                    throw err;
                }
            });
    }


    // SSH KEYS
    getAllSSHkeys() {
        const options = {
            method: 'GET',
            path: '/account/keys',
        };

        return this._makePaginateRequests('ssh_keys', options);
    }


    // IMAGES
    getAllImages(privateImagesOnly) {
        const qs = {};

        if (privateImagesOnly) {
            qs.private = true;
        }

        const options = {
            method: 'GET',
            path: '/images',
            qs,
        };

        return this._makePaginateRequests('images', options);
    }


    _makeRequest(options, body) {
        const path = url.format({
            pathname: `/v2${options.path}`,
            query: options.qs,
        });

        const reqOptions = {
            hostname: 'api.digitalocean.com',
            port: 443,
            method: options.method,
            path,
            headers: {
                Authorization: `Bearer ${this._token}`,
            },
        };

        // Add headers for payload
        let payload;
        if (body) {
            payload = JSON.stringify(body);

            reqOptions.headers['Content-Type'] = 'application/json';
            reqOptions.headers['Content-Length'] = Buffer.byteLength(payload);
        }

        return new Promise((resolve, reject) => {
            const req = https.request(reqOptions, (res) => {
                const chunks = [];

                res.on('error', (err) => reject(err));

                res.on('end', () => {
                    let resBody = Buffer.concat(chunks).toString();

                    // Convert to JSON if possible
                    try {
                        resBody = JSON.parse(resBody);
                    }
                    catch (err) {
                        // Ignore
                    }

                    // Transform wrong status code to error
                    if (res.statusCode < 200 || res.statusCode >= 300) {
                        return reject(resBody);
                    }

                    resolve(resBody);
                });

                res.on('data', (chunk) => chunks.push(chunk));
            });

            req.on('error', (err) => reject(err));

            if (payload) {
                req.write(payload);
            }

            req.end();
        });
    }


    _makePaginateRequests(key, options, body) {
        return this._makeRequest(options, body)
            .then((firstResult) => {
                if (!firstResult.links.pages || !firstResult.links.pages.next) {
                    return firstResult[key];
                }

                // Process the count of pages
                const totalItems = firstResult.meta.total,
                    itemPerPage = firstResult[key].length,
                    totalPage = Math.ceil(totalItems / itemPerPage);

                // Make a request for every other pages
                const pages = [];
                for (let i = 2; i <= totalPage; ++i) {
                    pages.push(i);
                }

                return Promise.map(pages, (page) => {
                    const newOptions = _.cloneDeep(options);

                    newOptions.qs = newOptions.qs || {};
                    newOptions.qs.page = page;

                    return this._makeRequest(newOptions, body)
                        .then((result) => result[key]);
                })
                    .then((results) => {
                        // Concat 1st results and others results
                        const joinedResults = firstResult[key].concat(_.flatten(results));

                        // Check coherency
                        if (joinedResults.length !== totalItems) {
                            throw new Error(`Total results (${totalItems}) doesn\'t match to joined results (${joinedResults.length})`);
                        }

                        return joinedResults;
                    });
            });
    }
};

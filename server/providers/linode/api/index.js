'use strict';

const _ = require('lodash'),
    Promise = require('bluebird'),
    request = require('request');


module.exports = class LinodeAPI {
    constructor(key) {
        this._key = key;
    }


    getAllLinodes() {
        return this._request('linode.list');
    }


    getAllLinodesWithIps() {
        return this.getAllLinodes()
            .then((linodes) => {
                const actions = linodes.map((linode) => ({
                    action: 'linode.ip.list',
                    params: {
                        LinodeID: linode.LINODEID,
                    },
                }));

                return this._requestsBatch(actions)
                    .then(
                        (ipsByLinodes) => ipsByLinodes.map(
                            (ipsByLinode) => _.first(ipsByLinode)
                        )
                    )
                    .then(
                        (ipByLinodes) => _
                            .zip(linodes, ipByLinodes)
                            .map(
                                (p) => _.merge(p[0], p[1])
                            )
                    );
            });
    }


    cloneLinode(LinodeID, DatacenterID, PlanID) {
        const params = {
            LinodeID,
            DatacenterID,
            PlanID,
        };

        return this._request('linode.clone', params);
    }


    updateLinodeLabel(LinodeId, prefix) {
        const params = {
            LinodeId,
            Label: `${prefix}${LinodeId}`,
        };

        return this._request('linode.update', params);
    }


    bootLinode(LinodeID) {
        const params = {
            LinodeID,
        };

        return this._request('linode.boot', params);
    }

    deleteLinode(LinodeID) {
        const params = {
            LinodeID,
            skipChecks: true,
        };

        return this._request('linode.delete', params);
    }


    getAllDatacenters() {
        return this._request('avail.datacenters');
    }


    getDatacenterIdByAbbr(abbr) {
        return this.getAllDatacenters()
            .then(
                (datacenters) => _(datacenters)
                    .filter({'ABBR': abbr})
                    .map('DATACENTERID')
                    .first()
            );
    }


    getAllPlans() {
        return this._request('avail.linodeplans');
    }


    getPlanIdByLabel(label) {
        return this.getAllPlans()
            .then(
                (plans) => _(plans)
                    .filter({'LABEL': label})
                    .map('PLANID')
                    .first()
            );
    }


    ////////////////

    _request(action, params) {
        return new Promise((resolve, reject) => {
            const form = _.merge({
                api_key: this._key,
                api_action: action,
            }, params);

            const payload = {
                method: 'POST',
                url: 'https://api.linode.com',
                form,
            };

            request(payload, (err, res, body) => {
                if (err) {
                    return reject(err);
                }

                const parsed = JSON.parse(body);
                if (parsed.ERRORARRAY.length > 0) {
                    return reject(parsed.ERRORARRAY);
                }

                return resolve(parsed.DATA);
            });
        });
    }


    _requestsBatch(actions) {
        return new Promise((resolve, reject) => {
            const requests = actions.map((action) => _.merge({
                api_action: action.action,
            }, action.params));

            const form = {
                api_key: this._key,
                api_action: 'batch',
                api_requestArray: JSON.stringify(requests),
            };

            const payload = {
                method: 'POST',
                url: 'https://api.linode.com',
                form,
            };

            request(payload, (err, res, body) => {
                if (err) {
                    return reject(err);
                }

                const parsed = JSON.parse(body);

                // Check for error
                for (let i = 0; i < parsed.length; ++i) {
                    const item = parsed[i];

                    if (item.ERRORARRAY.length > 0) {
                        return reject(item.ERRORARRAY);
                    }
                }

                const datas = _.map(parsed, 'DATA');

                return resolve(datas);
            });
        });
    }
};

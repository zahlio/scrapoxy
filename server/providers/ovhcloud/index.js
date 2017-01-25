'use strict';

const _ = require('lodash'),
    Promise = require('bluebird'),
    InstanceModel = require('../../proxies/manager/instance.model'),
    ovh = require('ovh'),
    ScalingError = require('../../common/error/scaling'),
    winston = require('winston');


module.exports = class ProviderOVHCloud {
    constructor(config, instancePort) {
        if (!config || !instancePort) {
            throw new Error('[ProviderOVHCloud] should be instanced with config and instancePort');
        }

        this._config = config;
        this._instancePort = instancePort;

        this.name = 'ovhcloud';

        this._flavorPromise = void 0;
        this._snapshotPromise = void 0;
        this._sshKeyPromise = void 0;

        const opts = _.pick(this._config, ['endpoint', 'appKey', 'appSecret', 'consumerKey']);
        this._client = ovh(opts);
    }


    static get ST_ACTIVE() {
        return 'ACTIVE';
    }

    static get ST_BUILD() {
        return 'BUILD';
    }

    static get ST_DELETING() {
        return 'DELETING';
    }

    static get ST_DELETED() {
        return 'DELETED';
    }

    static get ST_ERROR() {
        return 'ERROR';
    }


    get models() {
        const self = this;

        return self._describeInstances()
            .then(summarizeInfo)
            .then(excludeTerminated)
            .then(excludeOutscope)
            .then(convertToModel);

        ////////////

        function summarizeInfo(instancesDesc) {
            return _.map(instancesDesc,
                (instanceDesc) => _(instanceDesc)
                    .pick(['id', 'status', 'name'])
                    .extend({
                        ip: getIP(instanceDesc),
                    })
                    .value()
            );

            ////////////

            function getIP(instanceDesc) {
                if (!instanceDesc || !instanceDesc.ipAddresses ||
                    instanceDesc.ipAddresses.length <= 0) {
                    return;
                }

                return instanceDesc.ipAddresses[0].ip;
            }
        }

        function excludeTerminated(instancesDesc) {
            return _.filter(instancesDesc,
                (instanceDesc) =>
                instanceDesc.status !== ProviderOVHCloud.ST_DELETING &&
                instanceDesc.status !== ProviderOVHCloud.ST_DELETED
            );
        }

        function excludeOutscope(instancesDesc) {
            return _.filter(instancesDesc,
                (instanceDesc) => instanceDesc.name && instanceDesc.name.indexOf(self._config.name) === 0
            );
        }

        function convertToModel(instancesDesc) {
            return _.map(instancesDesc,
                (instanceDesc) => new InstanceModel(
                    instanceDesc.id,
                    self.name,
                    convertStatus(instanceDesc.status),
                    false,
                    buildAddress(instanceDesc.ip),
                    instanceDesc
                )
            );


            ////////////

            function buildAddress(ip) {
                if (!ip) {
                    return;
                }

                return {
                    hostname: ip,
                    port: self._instancePort,
                };
            }

            function convertStatus(status) {
                switch (status) {
                    case ProviderOVHCloud.ST_ACTIVE:
                    {
                        return InstanceModel.STARTED;
                    }
                    case ProviderOVHCloud.ST_BUILD:
                    {
                        return InstanceModel.STARTING;
                    }
                    case ProviderOVHCloud.ST_ERROR:
                    {
                        return InstanceModel.ERROR;
                    }
                    default:
                    {
                        winston.error('[ProviderOVHCloud] Error: Found unknown status:', status);

                        return InstanceModel.ERROR;
                    }
                }
            }
        }
    }


    createInstances(count) {
        const self = this;

        winston.debug('[ProviderOVHCloud] createInstances: count=%d', count);

        return self._describeInstances()
            .then((instances) => {
                const actualCount = _(instances)
                    .filter(
                        (instance) =>
                        instance.status !== ProviderOVHCloud.ST_DELETING &&
                        instance.status !== ProviderOVHCloud.ST_DELETED
                    )
                    .size();

                winston.debug('[ProviderOVHCloud] createInstances: actualCount=%d', actualCount);

                if (self._config.maxRunningInstances && actualCount + count > self._config.maxRunningInstances) {
                    throw new ScalingError(count, true);
                }

                return init()
                    .spread((flavor, snapshot, sshKey) => {
                        const promises = [];

                        for (let i = 0; i < count; ++i) {
                            promises.push(createInstance(flavor.id, snapshot.id, sshKey.id));
                        }

                        return Promise.all(promises);
                    });
            });


        ////////////

        function init() {
            // Get flavor id
            if (!self._flavorPromise) {
                self._flavorPromise = getFlavorByName(self._config.flavorName);
            }

            // Get snapshot id
            if (!self._snapshotPromise) {
                self._snapshotPromise = getSnapshotByName(self._config.snapshotName);
            }

            // Get ssh key id
            if (!self._sshKeyPromise) {
                self._sshKeyPromise = getSSHkeyByName(self._config.sshKeyName);
            }

            return Promise.all([
                self._flavorPromise,
                self._snapshotPromise,
                self._sshKeyPromise,
            ]);


            ////////////

            function getFlavorByName(name) {
                return new Promise((resolve, reject) => {
                    const options = {
                        serviceName: self._config.serviceId,
                        region: self._config.region,
                    };

                    self._client.request('GET', '/cloud/project/{serviceName}/flavor', options, (err, results) => {
                        if (err) {
                            return reject(`${err}: ${results}`);
                        }

                        const result = _.findWhere(results, {name});
                        if (!result) {
                            return reject(new Error(`Cannot find flavor by name '${name}'`));
                        }

                        resolve(result);
                    });
                });
            }

            function getSnapshotByName(name) {
                return new Promise((resolve, reject) => {
                    const options = {
                        serviceName: self._config.serviceId,
                        region: self._config.region,
                    };

                    self._client.request('GET', '/cloud/project/{serviceName}/snapshot', options, (err, results) => {
                        if (err) {
                            return reject(`${err}: ${results}`);
                        }

                        const result = _.findWhere(results, {name});
                        if (!result) {
                            return reject(new Error(`Cannot find snapshot by name '${name}'`));
                        }

                        resolve(result);
                    });
                });
            }

            function getSSHkeyByName(name) {
                return new Promise((resolve, reject) => {
                    const options = {
                        serviceName: self._config.serviceId,
                        region: self._config.region,
                    };

                    self._client.request('GET', '/cloud/project/{serviceName}/sshkey', options, (err, results) => {
                        if (err) {
                            return reject(`${err}: ${results}`);
                        }

                        const result = _.findWhere(results, {name});
                        if (!result) {
                            return reject(new Error(`Cannot find sshKey by name '${name}'`));
                        }

                        resolve(result);
                    });
                });
            }
        }

        function createInstance(flavorId, snapshotId, sshKeyId) {
            return new Promise((resolve, reject) => {
                const options = {
                    serviceName: self._config.serviceId,
                    region: self._config.region,
                    flavorId,
                    imageId: snapshotId,
                    name: self._config.name,
                    sshKeyId,
                };

                self._client.request('POST', '/cloud/project/{serviceName}/instance', options, (err, results) => {
                    if (err) {
                        if (err === 409 && results.indexOf('more instances' >= 0)) {
                            return reject(new ScalingError(count, false));
                        }

                        return reject(`${err}: ${results}`);
                    }

                    resolve();
                });
            });
        }
    }


    startInstance() {
        throw new Error('Unsupported method');
    }


    removeInstance(model) {
        winston.debug('[ProviderOVHCloud] removeInstance: model=', model.toString());

        return this._removeInstance(model.providerOpts.id);
    }


    _describeInstances() {
        return new Promise((resolve, reject) => {
            const options = {
                serviceName: this._config.serviceId,
                region: this._config.region,
            };

            this._client.request('GET', '/cloud/project/{serviceName}/instance', options, (err, instances) => {
                if (err) {
                    return reject(err);
                }

                resolve(instances);
            });
        });
    }


    _removeInstance(instanceId) {
        return new Promise((resolve, reject) => {
            const options = {
                serviceName: this._config.serviceId,
                instanceId,
            };

            this._client.request('DELETE', '/cloud/project/{serviceName}/instance/{instanceId}', options, (err, results) => {
                if (err) {
                    return reject(`${err}: ${results}`);
                }

                resolve(results);
            });
        });
    }
};

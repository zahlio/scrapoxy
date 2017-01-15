'use strict';

const _ = require('lodash'),
    Promise = require('bluebird'),
    API = require('./api'),
    InstanceModel = require('../../proxies/manager/instance.model'),
    ScalingError = require('../../common/error/scaling'),
    winston = require('winston');


module.exports = class ProviderVscale {
    constructor(config, instancePort) {
        if (!config || !instancePort) {
            throw new Error('[ProviderVscale] should be instanced with config and instancePort');
        }

        this._config = config;
        this._instancePort = instancePort;

        this.name = 'vscale';

        this._imagePromise = void 0;
        this._sshKeyPromise = void 0;
        
        this._api = new API(this._config.token);
    }


    static get ST_DEFINED() {
        return 'defined';
    }

    static get ST_CREATED() {
        return 'created';
    }

    static get ST_STARTED() {
        return 'started';
    }

    static get ST_STOPPED() {
        return 'stopped';
    }

    static get ST_BILLING() {
        return 'billing';
    }


    get models() {
        const self = this;

        return self._api.getAllServers()
            .then(summarizeInfo)
            .then(excludeRegion)
            .then(excludeOutscope)
            .then(convertToModel)

        ////////////

        function summarizeInfo(servers) {
            return _.map(servers, (server) => ({
                id: server.ctid.toString(),
                status: server.status,
                locked: server.locked,
                ip: _.get(server, 'public_address.address'),
                name: server.name,
                region: server.location,
            }));
        }

        function excludeRegion(servers) {
            return _.filter(servers,
                (server) => server.region === self._config.region
            );
        }

        function excludeOutscope(servers) {
            return _.filter(servers,
                (server) => server.name && server.name.indexOf(self._config.name) === 0
            );
        }

        function convertToModel(servers) {
            return _.map(servers, (server) => new InstanceModel(
                server.id,
                self.name,
                convertStatus(server.status),
                server.locked,
                buildAddress(server.ip),
                server
            ));


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
                    case ProviderVscale.ST_STARTED:
                    {
                        return InstanceModel.STARTED;
                    }
                    case ProviderVscale.ST_STOPPED:
                    {
                        return InstanceModel.STOPPED;
                    }
                    case ProviderVscale.ST_BILLING:
                    {
                        return InstanceModel.STOPPED;
                    }
                    case ProviderVscale.ST_CREATED:
                    {
                        return InstanceModel.STOPPED;
                    }
                    case ProviderVscale.ST_DEFINED:
                    {
                        return InstanceModel.STARTING;
                    }
                    default:
                    {
                        winston.error('[ProviderVscale] Error: Found unknown status:', status);

                        return InstanceModel.ERROR;
                    }
                }
            }
        }
    }

    createInstances(count) {
        const self = this;

        winston.debug('[ProviderVscale] createInstances: count=%d', count);

        return this._api.getAllServers()
            .then((servers) => {
                const actualCount = _(servers)
                    .size();

                winston.debug('[ProviderVscale] createInstances: actualCount=%d', actualCount);

                if (this._config.maxRunningInstances && actualCount + count > this._config.maxRunningInstances) {
                    throw new ScalingError(count, true);
                }

                return init()
                    .spread((image, sshKey) => createInstances(count, image.id, sshKey.id));
            })
            .catch((err) => {
                throw err;
            });


        ////////////

        function init() {
            // Get image id
            if (!self._imagePromise) {
                self._imagePromise = getImageByName(self._config.imageName);
            }

            // Get ssh key id
            if (!self._sshKeyPromise) {
                self._sshKeyPromise = getSSHkeyByName(self._config.sshKeyName);
            }

            return Promise.all([
                self._imagePromise,
                self._sshKeyPromise,
            ]);


            ////////////

            function getImageByName(name) {
                return self._api.getAllImages()
                    .then((images) => {
                        const image = _.findWhere(images, {name});
                        if (!image) {
                            throw new Error(`Cannot find image by name '${name}'`);
                        }

                        return image;
                    });
            }

            function getSSHkeyByName(name) {
                return self._api.getAllSSHkeys()
                    .then((sshKeys) => {
                        const sshKey = _.findWhere(sshKeys, {name});
                        if (!sshKey) {
                            throw new Error(`Cannot find ssh_key by name '${name}'`);
                        }

                        return sshKey;
                    });
            }

        }

        function createInstances(countOfServers, imageId, sshKeyId) {
            const names = Array(countOfServers);
            _.fill(names, self._config.name);

            const createOptions = {
                name: self._config.name,
                location: self._config.region,
                rplan: self._config.plan,
                make_from: imageId,
                keys: [sshKeyId],
                do_start: true,
            };

            return Promise.map(names, (name) => self._api.createServer(createOptions));
        }
    }


    startInstance(model) {
        winston.debug('[ProviderVscale] startInstance: model=', model.toString());

        return this._api.enableServer(model.providerOpts.id);
    }


    removeInstance(model) {
        winston.debug('[ProviderVscale] removeInstance: model=', model.toString());

        return this._api.removeServer(model.providerOpts.id);
    }

    removeInstances(models) {
        winston.debug('[ProviderVscale] removeInstances: models=',
            _.map(models, (model) => model.toString())
        );

        if (models.length <= 0) {
            return;
        }

        return Promise.map(models, (model) => this._api.removeServer(model.providerOpts.id));
    }
};
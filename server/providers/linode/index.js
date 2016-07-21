'use strict';

const _ = require('lodash'),
    Promise = require('bluebird'),
    API = require('./api'),
    InstanceModel = require('../../proxies/manager/instance.model'),
    ScalingError = require('../../common/error/scaling'),
    winston = require('winston');


module.exports = class ProviderLinode {
    constructor(config, instancePort) {
        if (!config || !instancePort) {
            throw new Error('[ProviderLinode] should be instanced with config and instancePort');
        }

        this._config = config;
        this._instancePort = instancePort;

        this.name = 'linode';

        this._datacenterPromise = void 0;
        this._planPromise = void 0;

        this._api = new API(this._config.key);
    }


    static get ST_CREATING() {
        return -1;
    }

    static get ST_NEW() {
        return 0;
    }

    static get ST_RUNNING() {
        return 1;
    }

    static get ST_OFF() {
        return 2;
    }


    get models() {
        const self = this;

        return self._api.getAllLinodesWithIps()
            .then(summarizeInfo)
            .then(excludeOutscope)
            .then(convertToModel);


        ////////////


        function summarizeInfo(linodes) {
            return _.map(linodes, (linode) => ({
                id: linode.LINODEID.toString(),
                status: linode.STATUS,
                ip: linode.IPADDRESS,
                name: linode.LABEL,
            }));
        }

        function excludeOutscope(linodes) {
            return _.filter(linodes,
                (linode) => linode.name && linode.name.indexOf(self._config.prefix) === 0
            );
        }

        function convertToModel(linodes) {
            return _.map(linodes, (linode) => new InstanceModel(
                linode.id,
                self.name,
                convertStatus(linode.status),
                buildAddress(linode.ip),
                linode
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
                    case ProviderLinode.ST_CREATING:
                    {
                        return InstanceModel.STARTING;
                    }
                    case ProviderLinode.ST_NEW:
                    {
                        return InstanceModel.STOPPED;
                    }
                    case ProviderLinode.ST_RUNNING:
                    {
                        return InstanceModel.STARTED;
                    }
                    case ProviderLinode.ST_OFF:
                    {
                        return InstanceModel.STOPPED;
                    }
                    default:
                    {
                        winston.error('[ProviderLinode] Error: Found unknown status:', status);

                        return InstanceModel.ERROR;
                    }
                }
            }
        }
    }

    createInstances(count) {
        const self = this;

        winston.debug('[ProviderLinode] createInstances: count=%d', count);

        return this._api.getAllLinodes()
            .then((linodes) => {
                const actualCount = linodes.length;

                winston.debug('[ProviderLinode] createInstances: actualCount=%d', actualCount);

                if (this._config.maxRunningInstances && actualCount + count > this._config.maxRunningInstances) {
                    throw new ScalingError(count, true);
                }

                const sourceLinodeID = getLinodeIDbyLabel(linodes, self._config.linodeMasterLabel);

                let validCount;
                if (count > 5) {
                    validCount = 5;
                    winston.debug('[ProviderLinode] createInstances: Warning! The maximum clone operation for Linode is 5. count = 5');
                }
                else {
                    validCount = count;
                }

                return init()
                    .spread((DatacenterID, PlanID) => createInstances(validCount, sourceLinodeID, DatacenterID, PlanID));
            })
            .catch((err) => {
                if (err.length > 0 && err[0].ERRORCODE === 15) {
                    throw new ScalingError(count, false);
                }

                throw err;
            });


        ////////////

        function getLinodeIDbyLabel(linodes, label) {
            const linode = _.findWhere(linodes, {LABEL: label});
            if (!linode) {
                throw new Error(`Cannot find linode by label '${label}'`);
            }

            return linode.LINODEID;
        }

        function init() {
            // Get DatacenterID
            if (!self._datacenterPromise) {
                self._datacenterPromise = self._api.getDatacenterIdByAbbr(self._config.datacenterAbbr);
            }

            // Get PlanID
            if (!self._planPromise) {
                self._planPromise = self._api.getPlanIdByLabel(self._config.planLabel);
            }

            return Promise.all([
                self._datacenterPromise,
                self._planPromise,
            ]);
        }

        function createInstances(countOfLinodes, sourceLinodeID, DatacenterID, PlanID) {
            const promises = [];
            for (let i = 0; i < countOfLinodes; ++i) {
                promises.push(createInstance(sourceLinodeID, DatacenterID, PlanID));
            }

            return Promise.all(promises);


            ////////////

            function createInstance(LinodeID, DatacenterID, PlanID) {
                return self._api.cloneLinode(LinodeID, DatacenterID, PlanID)
                    .then(
                        (linode) => self._api.updateLinodeLabel(linode.LinodeID, self._config.prefix)
                    );
            }
        }
    }


    startInstance(model) {
        winston.debug('[ProviderLinode] startInstance: model=', model.toString());

        return this._api.bootLinode(parseInt(model.providerOpts.id));
    }


    removeInstance(model) {
        winston.debug('[ProviderLinode] removeInstance: model=', model.toString());

        return this._api.deleteLinode(parseInt(model.providerOpts.id));
    }

    removeInstances(models) {
        winston.debug('[ProviderLinode] removeInstances: models=',
            _.map(models, (model) => model.toString())
        );

        if (models.length <= 0) {
            return;
        }

        return Promise.map(models,
            (model) => this._api.deleteLinode(parseInt(model.providerOpts.id))
        );
    }
};

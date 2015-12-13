'use strict';

const _ = require('lodash'),
    Router = require('koa-router'),
    tools = require('../tools');


module.exports = (config, manager) => {
    const router = new Router();

    router.get('/', getConfig);
    router.patch('/', updateConfig);

    return router.routes();


    ////////////

    function *getConfig() {
        this.status = 200;
        this.body = tools.omitDeep(config, ['password', 'test']);
    }

    function *updateConfig() {
        const payload = tools.omitDeep(this.request.body, ['password', 'test']);

        if (payload.instance && payload.instance.scaling) {
            tools.checkScalingIntegrity(payload.instance.scaling);
        }

        const oldConfig = _.cloneDeep(config);

        _.merge(config, payload);

        if (_.isEqual(config, oldConfig)) {
            this.status = 204;
        }
        else {
            manager.emit('config:updated', config);

            this.status = 200;
            this.body = tools.omitDeep(config, ['password', 'test']);
        }
    }
};
